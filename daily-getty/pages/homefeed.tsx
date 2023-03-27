import React, { useEffect, useMemo, useState } from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Stack from '@mui/material/Stack';
import Head from 'next/head'
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import { Container } from '@mui/system';
import HomeSearch from '@/src/components/homesearch';
import Post from '@/src/components/post';
import NavBar from '@/src/components/bottomnav';
import { useGetHomefeed } from './database/posts';
import { CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import { DatabasePost, DatabaseUser, DatabaseUserPostsResponse } from '@/types/FirebaseResponseTypes';
import { useSession } from 'next-auth/react';
import { requestFriendsForUser } from './database/profile';

export default function HomeFeed() {

    const [value, setValue] = React.useState(0);
    const { data: session, status } = useSession();
    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;
    const [homefeed, homefeedSuccess, homefeedLoading, getHomefeed] = useGetHomefeed(user.id);
    const [friends, setFriends] = useState([] as string[]);
    const [posts, setPosts] = useState([] as DatabasePost[])

    const friends_updated = friends.length !== 0;

    useEffect(() => {

        async function pullFriends() {
            const dbFriendsResponse = await requestFriendsForUser(user.id);

            if(!dbFriendsResponse.success)
                return;

            if(!dbFriendsResponse.friends)
                return;

            setFriends(dbFriendsResponse.friends.following);
        }

        pullFriends()
        .catch(console.error);
        //getHomefeed()
    }, [user.id])

    useEffect(() => {
        if(!friends_updated)
            return;


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

                if(!json.posts)
                    return;

                const user_posts: DatabasePost[] = Object.keys(json.posts).map((post_id) => {
                    return json.posts[post_id] as DatabasePost
                })

                blankPosts.push(...user_posts)
                
            });

            await Promise.all(promise);

            blankPosts.sort((a, b) => {return a.id < b.id});

            console.log(blankPosts)

        }

        pullBlankPostsFromFriends()
        .catch(console.error)

    }, [friends_updated])


    // console.log({friends: friends, user_id: user.id})

    let homefeed_map = homefeed ? homefeed : {}

    return (
        <>
            <Head>
                <title>Home Feed</title>
            </Head>
            <main>
                <Box sx={{ flexGrow: 1, mb: 10, width: '100%', height: '100vh' }}>
                    <HomeSearch />
                    <Container fixed>
                        <CssBaseline />
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            {homefeedLoading && !homefeedSuccess && (
                                <CircularProgress
                                    size={68}
                                    sx={{
                                        color: green[500],
                                    }}
                                />
                            )}

                            {/* <center> */}
                            <Stack spacing={5}>
                                <ImageList cols={1} rowHeight={600}>

                                    {
                                        !homefeedLoading && homefeedSuccess && Object.keys(homefeed_map).map((post) => (
                                            // <Post userObj={user} post={homefeed[post]} key={homefeed[post].id} />
                                            <ImageListItem key={homefeed[post].id} >
                                                <Post userObj={user} post={homefeed[post]} key={homefeed[post].id} />
                                            </ImageListItem>
                                        ))
                                    }

                                </ImageList>
                            </Stack>

                            {/* </center> */}


                            {/* <List>
                            {
                                !homefeedLoading && homefeedSuccess &&  Object.keys(homefeed_map).map((post) => (
                                    <Post userObj={user} post={homefeed[post]} key={homefeed[post].id} />
                                ))
                            }
                            
                        </List> */}
                        </Box>
                    </Container>
                    <NavBar />
                </Box>
            </main>
        </>
    )
}
