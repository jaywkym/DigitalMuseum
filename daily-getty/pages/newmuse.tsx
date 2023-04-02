import React from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
// import NavBar from '@/src/components/bottomnav';
// import HomeSearch from '@/src/components/homesearch';
import abstractbg from "./public/abstractbg.jpg"
import CheckItemExists from "@/src/components/checkPostExistence"

export default function NewMuse() {
    return (
        <>
            <div style={{
                zIndex: -1,
                position: "fixed",
                width: "100vw",
                height: "100vh",
            }}>
                <Image src={abstractbg} alt="background" object-fit="cover" fill></Image>
            </div>
            <Head>
                <title>Create Daily Image!</title>
            </Head>
            <main>
                {/* <HomeSearch /> */}
                <CssBaseline />
                <Box sx={{
                    flexGrow: 1,
                    m: 8,
                    paddingTop: 8,
                    p: 3,
                    bgcolor: '#FFFFFF',
                    boxShadow: 4,
                }}>
                    {/*<Prompt />*/}
                    {/* <MuseForm /> */}
                    <CheckItemExists />
                </Box>
                {/* <NavBar /> */}
            </main>
        </>
    )
}
