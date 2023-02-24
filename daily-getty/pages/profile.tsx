import * as React from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import { Avatar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import { Container } from '@mui/system';
import Post from '@/src/components/post';
import NavBar from '@/src/components/bottomnav';
import ProfileHeader from '@/src/components/profileheader';

export default function Profile() {

    return (
        <>
            <Head>
                <title>Profile Page</title>
            </Head>
            <main>
                <Box sx={{ flexGrow: 1 }}>
                    <ProfileHeader />
                    <List>
                        <Post />
                    </List>
                    <Box sx={{ m: 15 }}></Box>
                    <NavBar />
                </Box>
            </main>
        </>
    )
}
