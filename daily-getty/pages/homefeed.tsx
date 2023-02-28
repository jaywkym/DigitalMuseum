import * as React from 'react';
import Head from 'next/head'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import { Container } from '@mui/system';
import HomeSearch from '@/src/components/homesearch';
import Post from '@/src/components/post';
import NavBar from '@/src/components/bottomnav';

export default function HomeFeed() {

    const [value, setValue] = React.useState(0);

    return (
        <>
            <Head>
                <title>Home Feed</title>
            </Head>
            <main>
                <Box sx={{ flexGrow: 1 }}>
                    <HomeSearch />
                    <Container fixed>
                        <CssBaseline />
                        <List>
                            <Post></Post>
                            <Post></Post>
                            <Post></Post>
                        </List>
                    </Container>
                    <Box sx={{ m: 5 }}></Box>
                    <NavBar />
                </Box>
            </main>
        </>
    )
}
