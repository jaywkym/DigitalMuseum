import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import Post from '@/src/components/post';
import NavBar from '@/src/components/bottomnav';
import ProfileHeader from '@/src/components/profileheader';
import { requestPostFromUserById } from '@/pages/database/posts';
import { useSession } from 'next-auth/react';
import { DatabasePost, DatabaseUser, DatabaseUserPostsResponse } from '@/types/FirebaseResponseTypes';
import { green } from '@mui/material/colors';
import HomeSearch from '@/src/components/homesearch';

export default function Profile() {

    const { data: session, status } = useSession();
    const [posts, setPosts] = useState([] as DatabasePost[]);
    const [loading, setLoading] = useState(false);

    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;
    const userSet = user.id !== undefined;

    async function loadImages(blankPosts) {

        blankPosts.forEach(async (post) => {

            const postRequest = await requestPostFromUserById(user.id, post.id)
            const rPost = postRequest.post;

            if (!postRequest.success) {
                console.error("ERROR: Could not fetch post")
                console.error(postRequest);
                return;
            }

            const newPosts = blankPosts.map((newPost) => {
                if (newPost.id === rPost.id)
                    newPost.image.url = rPost.image.url

                return newPost;
            })

            setPosts(newPosts)

        })

        setLoading(false);

    }

    async function loadBlankPosts() {

        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user.id,
            })
        }

        const resp = await fetch(`/api/database/posts/getAllPostsFromUser`, request)
        const dbResponse = await resp.json() as DatabaseUserPostsResponse;
        const dbPosts = dbResponse.posts;

        const blankPosts = Object.keys(dbPosts).map((id) => {
            return dbPosts[id];
        })

        blankPosts.sort().reverse()

        setPosts(blankPosts)

        return blankPosts;

    }

    useEffect(() => {

        if (!userSet)
            return;

        setLoading(true);
        setPosts([])

        loadBlankPosts()
            .then(loadImages)
            .catch(err => console.error(err))

    }, [userSet])

    let posts_map = posts ? posts : {}

    return (
        <>
            <Head>
                <title>Profile Page</title>
            </Head>
            <main>
                <HomeSearch />
                <Box sx={{ flexGrow: 1, m: 10 }}>
                    {/* <Button onClick={() => { signOut(); }}>Logout</Button> */}
                    <CssBaseline />
                    <ProfileHeader user={user} session={session}/>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        {loading && (
                            <CircularProgress
                                size={68}
                                sx={{
                                    color: green[500],
                                }}
                            />
                        )}
                        <List>
                            {
                                Object.keys(posts_map).map((post) => (
                                    <Post _userObj={user} _post={posts[post]} key={posts[post].id} session={session} />
                                ))
                            }
                        </List>
                    </Box>
                </Box>
                <NavBar />
            </main>
        </>
    )
}
