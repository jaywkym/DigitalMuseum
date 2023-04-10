import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import { CircularProgress, ImageList, ImageListItem } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Post from '@/src/components/post';
import NavBar from '@/src/components/navbar';
import ProfileHeader from '@/src/components/profileheader';
import { requestPostFromUserById } from '@/pages/database/posts';
import { useSession } from 'next-auth/react';
import { DatabasePost, DatabaseUser, DatabaseUserPostsResponse } from '@/types/FirebaseResponseTypes';
import { green } from '@mui/material/colors';
import useScreenSize from '@/pages/database/pages';

export default function Profile() {

    const { data: session, status } = useSession();


    const [isXS, isSM, isMD, isLG, isXL] = useScreenSize();

    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;


    return (
        <>
            <Head>
                <title>Profile Page</title>
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

                </Box>
            </Box>
                
            </main>
        </>
    )
}
