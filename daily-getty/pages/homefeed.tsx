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
import { requestPostFromUserById } from './database/posts';
import { CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import { DatabasePost, DatabaseUser, DatabaseUserPostsResponse } from '@/types/FirebaseResponseTypes';
import { useSession } from 'next-auth/react';
import { requestFriendsForUser } from './database/profile';

export default function HomeFeed() {

    const [value, setValue] = React.useState(0);
    const { data: session, status } = useSession();
    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;
    const [friends, setFriends] = useState([] as string[]);
    const [posts, setPosts] = useState([] as DatabasePost[])

    const friends_updated = friends && friends.length !== 0;
    const posts_updated = posts && posts.length !== 0;

    useEffect(() => {

        async function pullFriends() {
            const dbFriendsResponse = await requestFriendsForUser(user.id);

            if (!dbFriendsResponse.success)
                return;

            if (!dbFriendsResponse.friends)
                return;

            if (!dbFriendsResponse.friends.following)
                setFriends([] as string[])
            else
                setFriends(dbFriendsResponse.friends.following);
        }

        pullFriends()
            .catch(console.error);

    }, [user.id])

    useEffect(() => {
        if (!friends_updated)
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
                if (!json.success)
                    return;

                if (!json.posts)
                    return;

                const user_posts: DatabasePost[] = Object.keys(json.posts).map((post_id) => {
                    return json.posts[post_id] as DatabasePost
                })

                blankPosts.push(...user_posts)

            });

            await Promise.all(promise);

            blankPosts.sort((a, b) => { return a.id < b.id ? 1 : 0 });
            setPosts(blankPosts)

        }

        pullBlankPostsFromFriends()
            .catch(console.error)

    }, [friends_updated])

    useEffect(() => {
        if (!posts_updated)
            return;

        async function pullAllPosts() {

            const promises = posts.map(async (blank_post) => {

                const dbResponse = await requestPostFromUserById(blank_post.user_id, blank_post.id)
                if (!dbResponse.success)
                    return;

                if (!dbResponse.post)
                    return;

                const post = dbResponse.post;
                let current_index = 0;

                posts.forEach((current_post) => {

                    if (current_post.id == post.id && current_post.user_id == post.user_id) {
                        posts[current_index].image.b64 = post.image.b64
                        console.log(posts[current_index])
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

    }, [posts_updated])

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
                            {!posts_updated && (
                                <CircularProgress
                                    size={68}
                                    sx={{
                                        color: green[500],
                                    }}
                                />
                            )}

                            {/* <center> */}
                            <Stack spacing={10}>
                                <ImageList cols={2} rowHeight={400} gap={10}>
                                    {
                                        posts_updated && posts.map((post) => (

                                            <ImageListItem key={'li-' + post.user_id + '-' + post.id} >
                                                <Post _userObj={user} _post={post} key={'p-' + post.user_id + '-' + post.id} />
                                            </ImageListItem>
                                        ))
                                    }

                                </ImageList>
                            </Stack>
                        </Box>
                    </Container>
                    <NavBar />
                </Box>
            </main>
        </>
    )
}
