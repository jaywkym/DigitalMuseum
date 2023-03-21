import React, {useEffect, useMemo, useState} from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import { Avatar, CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import { Container } from '@mui/system';
import { Button } from '@mui/material';
import Post from '@/src/components/post';
import NavBar from '@/src/components/bottomnav';
import ProfileHeader from '@/src/components/profileheader';
import { signOut } from 'next-auth/react';
import { useGetAllPostIds, requestPostFromUserById } from '@/pages/database/posts';
import { useSession } from 'next-auth/react';
import { DatabasePost, DatabaseUser, DatabaseUserPostsResponse } from '@/types/FirebaseResponseTypes';
import { green } from '@mui/material/colors';

export default function Profile() {

    const {data: session, status} = useSession();

    const user: DatabaseUser = session? session.user as DatabaseUser : {} as DatabaseUser;
    // const [posts, getPostsSuccess, getPostsLoading, getAllPostsForUser] = useGetAllPostsForUser(user.id);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const fetchImages = async () => {

            if(!user.id) 
                return;

            setLoading(true);
            setPosts([])
            
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

            Object.keys(dbPosts).forEach(async (post) => {

                const postRequest = await requestPostFromUserById(user.id, dbPosts[post].id)

                if(!postRequest.success) {
                    console.error("ERROR: Could not fetch post")
                    console.error(postRequest);
                    return;
                }
        
                if(!posts.includes(postRequest.post))
                    setPosts(posts => [...posts, postRequest.post])

            })

            setLoading(false);
        }

        fetchImages()
        .catch(err => {
            console.log(err)
        })

    }, [user.id])

    let posts_map = posts? posts : {}
    console.log(posts_map)

    return (
        <>
            <Head>
                <title>Profile Page</title>
            </Head>
            <main>
                <Box sx={{ flexGrow: 1, m: 10 }}>
                    <Button onClick={() => { signOut(); }}>Logout</Button>
                    <CssBaseline />
                    <ProfileHeader user={user}/>
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
                                    <Post userObj={user} post={posts[post]} key={posts[post].id} />
                                ))
                            }
                            
                        </List>
                    </Box>
                    <NavBar />
                </Box>
            </main>
        </>
    )
}
