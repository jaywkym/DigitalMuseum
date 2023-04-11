import React, { useEffect, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Head from 'next/head'
import Box from '@mui/material/Box';
import Post from '@/src/components/post';
import { requestPostFromUserById } from './database/posts';
import { DatabasePost, DatabaseUser, DatabaseUserPostsResponse } from '@/types/FirebaseResponseTypes';
import { useSession } from 'next-auth/react';
import { requestFriendsForUser } from './database/profile';
import NavBar from '@/src/components/navbar';
import useScreenSize from './database/pages';
import { Typography } from '@mui/material';

export default function HomeFeed() {

    const { data: session, status } = useSession();
    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;
    const [friends, setFriends] = useState([] as string[]);
    const [posts, setPosts] = useState([] as DatabasePost[])
    const [isXS, isSM, isMD, isLG, isXL] = useScreenSize();
    const [pulledFriends, setPulledFriends] = useState(false);

    const friends_updated = friends && friends.length !== 0;
    const posts_updated = posts && posts.length !== 0;
    const noFriends = pulledFriends && friends.length === 0;

    useEffect(() => {

        if(user.id === undefined)
            return;

        async function pullFriends() {
            const dbFriendsResponse = await requestFriendsForUser(user.id);

            if(!dbFriendsResponse.success)
                return;

            if(!dbFriendsResponse.friends){
                return;
            }
               
            if(!dbFriendsResponse.friends.following)
                setFriends([] as string[])
            else
                setFriends(dbFriendsResponse.friends.following);
        }

        pullFriends()
        .catch(console.error);

    }, [user.id])

    useEffect(() => {

        async function pullBlankPostsFromFriends() {

            const blankPosts: DatabasePost[] = [];

            const promise = await friends.map(async (friend_id) => {

                const request = {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        user_id: friend_id,
                    })
                }

                const dbResponse = await fetch(`/api/database/posts/getAllPostsFromUser`, request)
                const json = await dbResponse.json() as DatabaseUserPostsResponse;

                if(!json.success)
                    return;

                if(!json.posts){
                    return;
                }

                const user_posts: DatabasePost[] = Object.keys(json.posts).map((post_id) => {
                    return json.posts[post_id] as DatabasePost
                })

                blankPosts.push(...user_posts)
                
            });

            await Promise.all(promise);

            blankPosts.sort((a, b) => {
                const date_a = (new Date(a.id.replaceAll('_', '-'))).getTime()
                const date_b = (new Date(b.id.replaceAll('_', '-'))).getTime()
    
                 return date_a < date_b? 1 : 0;
            })
            
            setPosts(blankPosts)
            setPulledFriends(true)

        }

        pullBlankPostsFromFriends()
        .catch(console.error)

    }, [friends])

    useEffect(() => {

        async function pullAllPosts() {

            const promises = posts.map(async (blank_post) => {
                
                const dbResponse = await requestPostFromUserById(blank_post.user_id, blank_post.id)
                if(!dbResponse.success)
                
                    return;

                if(!dbResponse.post)
                    return;

                const post = dbResponse.post;
                let current_index = 0;

                posts.forEach((current_post) => {

                    if(current_post.id == post.id && current_post.user_id == post.user_id) {
                        posts[current_index].image.url = post.image.url
                        return;
                    }

                    ++current_index;

                })
                
                return dbResponse.post

            });

            await Promise.all(promises);
        }

        pullAllPosts()
        .catch(console.error)

    }, [posts])

    return (
        <>
            <Head>
                <title>Home Feed</title>
            </Head>
            <main>
            <Box 
                position={'fixed'} 
                width={'100vw'} 
                height={'100vh'} 
                sx={{backgroundColor: 'common.blueScheme.background'}} 
                zIndex={-10}
            >

            </Box>
            <NavBar isMobile={isXS} session={session} />
           
            <Box display={'flex'} justifyContent={'end'} flexDirection={'column'} alignItems={'end'}>
                <Box 
                    sx={{
                        width: {xs: '100%', sm: '90%', md: '80%'}, 
                    }}

                    display={'flex'}
                    justifyContent={'center'}
                    padding={4}
                >

                    <Box sx={{ flexGrow: 1}}>
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                alignItems: 'center', 
                                alignContent: 'center' 
                            }}

                                marginTop={4}
                        >

                            {   noFriends &&
                                <Typography variant={'h4'} color={'common.blueScheme.notWhite'}>
                                    You are not following anyone. Check out the explore page to find users.
                                </Typography>

                            }
                            
                            
                             <ImageList cols={isXS ? 1 : isSM ? 3 : 2}  gap={20}>

                                {
                                        
                                        posts.map((post, i) => (
                                        <ImageListItem key={i} >
                                            <Post _userObj={user} _post={post} key={post.user_id + "-" + post.id} session={session}/>
                                        </ImageListItem>
                                    ))
                                }

                             </ImageList>
                             </Box>
                        </Box>

                </Box>
            </Box>
                    
                {/* <Box sx={{ flexGrow: 1, mb: 10, width: '100%', height: '100vh' }}>
                    <HomeSearch />
                    <Container fixed>
                        <CssBaseline />
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            {!posts_updated && (
                                <CircularProgress
                                    size={68}
                                    sx={{
                                        color: green[500],
                                    }}
                                />
                            )}

                            <Stack spacing={5}>
                                <ImageList cols={1} rowHeight={600}>

                                    {
                                        posts_updated && posts.map((post) => (

                                            <ImageListItem key={'li-' + post.user_id + '-' + post.id} >
                                                <Post _userObj={user} _post={post} key={'p-' + post.user_id + '-' + post.id} session={session}/>
                                            </ImageListItem>
                                        ))
                                    }

                                </ImageList>
                            </Stack>
                        </Box>
                    </Container>
                </Box> */}
            </main>
        </>
    )
}
