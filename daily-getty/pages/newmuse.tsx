import * as React from 'react';
import useImage from './dalle/images';
import Head from 'next/head'
import Box from '@mui/material/Box';
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from '@/src/components/bottomnav';
import MuseForm from '@/src/components/uploadform';
import Prompt from '@/src/components/prompt';
import Loading from '@/src/components/loading';
import loading from './dalle/images';
import HomeSearch from '@/src/components/homesearch';

export default function NewMuse() {

    function testing(){
        console.log("hello functionality")         
    }



    return (
        <>
            <Head>
                <title>Home Feed</title>
            </Head>
            <main>
                <HomeSearch />
                <Box sx={{ flexGrow: 1, m: 8 }}>

                
                    <CssBaseline />
                    <Prompt />
                    <MuseForm />
                    <NavBar />
                </Box>
            </main>
        </>
    )
}
