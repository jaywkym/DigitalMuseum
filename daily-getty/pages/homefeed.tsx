import React, { useEffect } from 'react';
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
import { DatabaseUser } from '@/types/FirebaseResponseTypes';
import { useSession } from 'next-auth/react';

export default function HomeFeed() {

    const [value, setValue] = React.useState(0);
    const { data: session, status } = useSession();
    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;
    const [homefeed, homefeedSuccess, homefeedLoading, getHomefeed] = useGetHomefeed(user.id);

    useEffect(() => {
        getHomefeed()
    }, [user])

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
                            <Stack spacing={4}>

                                <ImageList cols={3} rowHeight={400}>

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
