import React, {useEffect} from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import { Avatar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import { Container } from '@mui/system';
import { Button } from '@mui/material';
import Post from '@/src/components/post';
import NavBar from '@/src/components/bottomnav';
import ProfileHeader from '@/src/components/profileheader';
import { signOut } from 'next-auth/react';
import { useGetAllPostsForUser } from '@/pages/database/posts';
import { useSession } from 'next-auth/react';
import { DatabaseUser } from '@/types/FirebaseResponseTypes';

export default function Profile() {

    const {data: session, status} = useSession();

    const user: DatabaseUser = session? session.user as DatabaseUser : {} as DatabaseUser;
    const [posts, getPostsSuccess, getPostsLoading, getAllPostsForUser] = useGetAllPostsForUser(user.id);

    useEffect(() => {
        getAllPostsForUser()
    }, [user])

    let posts_map = posts? posts : {}

    console.log(user)

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
