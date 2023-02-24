import * as React from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from '@/src/components/bottomnav';
import MuseForm from '@/src/components/uploadform';
import Prompt from '@/src/components/prompt';

export default function NewMuse() {


    return (
        <>
            <Head>
                <title>Home Feed</title>
            </Head>
            <main>
                <Box sx={{ flexGrow: 1 }}>
                    <CssBaseline />
                    <Prompt />
                    <MuseForm />
                    <NavBar />
                </Box>
            </main>
        </>
    )
}
