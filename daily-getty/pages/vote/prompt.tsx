import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import { CircularProgress, ImageList, ImageListItem, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Post from '@/src/components/post';
import NavBar from '@/src/components/navbar';
import ProfileHeader from '@/src/components/profileheader';
import { requestPostFromUserById } from '@/pages/database/posts';
import { useSession } from 'next-auth/react';
import { DatabasePost, DatabaseUser, DatabaseUserPostsResponse } from '@/types/FirebaseResponseTypes';
import { green } from '@mui/material/colors';
import useScreenSize from '@/pages/database/pages';
import { DatabaseVotingPrompt, UserVotedResponse, VotingPromptsResponse } from '@/types/DalleResponseTypes';

export default function Prompt() {

    const { data: session, status } = useSession();


    const [isXS, isSM, isMD, isLG, isXL] = useScreenSize();
    const [prompts, setPrompts] = useState([] as string[])
    const [userVoted, setUserVoted] = useState(-1);
    const [refresh, setRefresh] = useState(false)

    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;
    const userSet = user.id !== undefined;
    const userAlreadyVoted = userVoted == -1? false : true;

    useEffect(() => {

        if(!userSet)
            return;

        async function getUserVoted() {
            const request = {
                method: 'POST',
                headers: {
                    'Content-Type' : 'Application/json'
                },
                body: JSON.stringify({user_id: user.id})
            }

            try {
                const resp = await fetch('/api/database/prompt/checkUserVoted', request);
                const userVotedObj = await resp.json() as UserVotedResponse
                if(!userVotedObj.success)
                    return;

                setUserVoted(userVotedObj.prompt)
            } catch (err: any) {
                console.error(err)
                setUserVoted(-1);
            }
        }

        getUserVoted()
        .catch(console.error)

    }, [userSet, refresh])

    useEffect(() => {

        async function getVotingPrompts() {

            try {
                const resp = await fetch('/api/database/prompt/getAllVotes', {method: 'POST'});
                const votingPromptsResponse = await resp.json() as VotingPromptsResponse

                if(!votingPromptsResponse.success) {
                    setPrompts([] as string[])
                    return;
                }

                const received_prompts = votingPromptsResponse.prompts;

                const prompts: string[] = []

                received_prompts.forEach(prompt => {
                    prompts.push(prompt.prompt)
                })

                setPrompts(prompts)

            } catch (err: any) {
                console.error(err)
                setPrompts([] as string[])
            }
        }

        getVotingPrompts()
        .catch(console.error)

    }, [])

    async function voteOnPrompt(index) {

        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json'
            },
            body: JSON.stringify({
                user_id: user.id,
                prompt_id: index
            })
        }

        try {
            const resp = await fetch('/api/database/prompt/vote', request);
            const json = await resp.json();
            console.log(json);
        } catch (err: any) {
            console.error(err);
        } finally {
            setRefresh(true)
        }

    }

    console.log({
        voted: userVoted,
        prompts: prompts
    })


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
                
                    textAlign={'center'}
                    padding={4}
                >
                    <Typography variant={'h2'} color={'common.blueScheme.notWhite'} marginBottom={'10px'}>
                        Vote on tomorrows prompt
                    </Typography>

                    {  userAlreadyVoted &&
                        <Typography variant={'h4'} color={'#aaa'} margin={5}>
                            Thank you for voting! Come back tomorrow to see new prompts!
                        </Typography>

                    }

                    <Box
                        width={'100%'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyItems={'center'}
                        justifyContent={'center'}
                        alignItems={'center'}
                    >
                    {  
                        prompts.map((prompt, index) => (
                            <Box 
                                key={index} 
                                width={'90%'} 
                                minHeight={'100px'}
                                display={'flex'}
                                alignItems={'center'}
                                justifyContent={'center'}
                                sx={{
                                    backgroundColor: userVoted === index? 'common.blueScheme.background' : 'common.blueScheme.foreground',
                                    scale: userVoted === index? '1.03' : 1,
                                    ":hover": {
                                        cursor: !userAlreadyVoted? 'pointer': 'auto',
                                        backgroundColor: !userAlreadyVoted? 'common.blueScheme.background' : userVoted === index? 'common.blueScheme.background' : 'common.blueScheme.foreground',
                                        scale: !userAlreadyVoted? '1.03' : 1
                                    }
                                }}
                                marginBottom={'5px'}
                                borderRadius={'10px'}
                                border={'1px solid black'}
                                boxShadow={'1px 1px 1px 1px'}
                                onClick={() => {
                                    voteOnPrompt(index)
                                }}
                                
                            >
                                <Typography variant={'body1'} color={'common.blueScheme.notWhite'}>{prompt}</Typography>
                            </Box>
                        ))
                    }
                    </Box>
                </Box>
            </Box>
                
            </main>
        </>
    )
}
