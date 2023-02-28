import * as React from 'react';
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

export default function Profile() {

    return (
        <>
            <Head>
                <title>Profile Page</title>
            </Head>
            <main>
                <Box sx={{ flexGrow: 1, m: 10 }}>
                    <Button onClick={() => { signOut(); }}>Logout</Button>
                    <ProfileHeader />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        <List>
                            <Post />
                            <Post />
                        </List>
                    </Box>
                    <NavBar />
                </Box>
            </main>
        </>
    )
}
