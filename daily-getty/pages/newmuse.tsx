import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
// import NavBar from '@/src/components/bottomnav';
// import HomeSearch from '@/src/components/homesearch';
import abstractbg from "./public/abstractbg.jpg"
import CheckItemExists from "@/src/components/checkPostExistence"
import NavBar from '@/src/components/navbar';
import { useSession } from 'next-auth/react';
import useScreenSize from './database/pages';
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Slide, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import generatePrompt from '@/src/components/generateprompt';

type Step = {
    label: string;
}

export default function NewMuse() {

    const { data: session, status } = useSession();
    const [isXS, isSM, isMD, isLG, isXL] = useScreenSize();
    const [activeStep, setActiveStep] = useState(0);

    const [udatedQuestion, setUpdated] = useState(false);

    const [prompt, setPrompt] = useState('')
    const [userResponse, setUserResponse] = useState('');
    const [artStyle, setArtStyle] = useState('');

    const inputContainerRef = useRef(null);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };

    console.log({
        userResponse: userResponse
    })

    const steps: Step[] = [
        {label: 'Answer prompt'},
        {label: 'Choose Art Style'},
        {label: 'Choose Image'},
        {label: 'Complete'}
    ]

    useEffect(() => {
        generatePrompt()
        .then(setPrompt)
        .catch(console.error)
    }, [])

    

    return (
        <>

            <Head>
                <title>Create Daily Image!</title>
            </Head>
            <main>
                <Box 
                    position={'fixed'} 
                    width={'100vw'} 
                    height={'100vh'} 
                    sx={{backgroundColor: 'common.blueScheme.background'}} 
                    zIndex={-10}
                ></Box>
                <NavBar isMobile={isXS} session={session} isUpdated={udatedQuestion}/>
                    <Box display={'flex'} justifyContent={'end'} flexDirection={'column'} alignItems={'end'}>
                        <Box 
                            sx={{
                                width: {xs: '100%', sm: '90%', md: '80%'}, 
                            }}

                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'center'}
                            padding={4}
                        >
                            <Box padding={3}>
                                <Typography
                                    textAlign={'center'}
                                    variant={'h2'}
                                    color={'common.blueScheme.notWhite'}
                                >
                                    Generate New Muse!
                                </Typography>
                            </Box>

                            <Container
                                sx={{
                                    width: '95%', 
                                    backgroundColor: 'common.blueScheme.foreground',
                                    boxShadow: '3px 3px 6px 6px',
                                    padding: 5
                                }}

                                ref={inputContainerRef}
                            >
                                <Box>
                                    <Typography variant={'h3'} color={'common.blueScheme.notWhite'} paddingBottom={2}>
                                        Prompt of the Day
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant={'h5'} color={'#888'} paddingBottom={2}>
                                        {prompt}
                                    </Typography>
                                    
                                </Box>
                                <Box
                                    display={'flex'}

                                >
                                    <Slide
                                        direction={activeStep === 0? 'left' : 'right'}
                                        in={activeStep === 0}
                                        container={inputContainerRef.current}
                                        mountOnEnter
                                        unmountOnExit
                                    >
                                        <TextField
                                            id="prompt-field"
                                            label="Place Response here"
                                            sx={{backgroundColor: 'common.blueScheme.notWhite'}}
                                            size={'medium'}
                                            fullWidth
                                            multiline
                                            onChange={(e) => setUserResponse(e.target.value)}
                                            value={userResponse}
                                            placeholder='Like a spoon in the wind...'
                                        ></TextField>
                                    </Slide>
                                    <Slide
                                        direction={activeStep === 1? 'left' : 'right'}
                                        in={activeStep === 1}
                                        container={inputContainerRef.current}
                                        mountOnEnter
                                        unmountOnExit
                                    >
                                    <FormControl fullWidth>
                                        <InputLabel id="select-label">Art Style</InputLabel>
                                        <Select
                                            labelId={'select-art-style'}
                                            id={'select-art-style'}
                                            value={artStyle}
                                            label="Art Style"
                                            onChange={(e) => setArtStyle(e.target.value)}
                                            color={'primary'}
                                            sx={{backgroundColor: 'white'}}
                                        >

                                            <MenuItem value={"abstract"}>Abstract</MenuItem>
                                            <MenuItem value={"animated"}>Animated</MenuItem>
                                            <MenuItem value={"pop-art"}>Pop Art</MenuItem>
                                            <MenuItem value={"realism"}>Realism</MenuItem>
                                            <MenuItem value={"retro"}>Retro</MenuItem>

                                        </Select>
                                    </FormControl>
                                    </Slide>
                                </Box>
                                
                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'space-between'}
                                    alignContent={'center'}
                                >
                                    <Button onClick={handleBack} sx={{margin: '40px 0'}} disabled={activeStep !== 1}>
                                        <NavigateBeforeIcon /> 
                                        {
                                            activeStep === 1 && <Typography>Edit Response</Typography>
                                        }
                                    </Button>
                                    <Button onClick={handleNext} sx={{margin: '40px 0'}}>
                                        {
                                            activeStep === 0 && <Typography>Select Art Style</Typography>
                                        }{
                                            activeStep === 1 && <Typography>Generate Images</Typography>
                                        }{
                                            activeStep === 2 && <Typography>Post Image</Typography>
                                        }{
                                            activeStep === 3 && <Typography>See Image</Typography>
                                        }
                                         <NavigateNextIcon />
                                    </Button>

                                </Box>
                                <Stepper activeStep={activeStep} orientation={'horizontal'} sx={{width: '100%'}}>
                                    {steps.map((step, index) => (
                                        <Step key={step.label} sx={{color: 'white'}}>
                                            <StepLabel>
                                                <Typography sx={{color: 'white'}}>
                                                    {step.label}
                                                </Typography>

                                            </StepLabel>
                                            </Step>
                                        
                                    ))}
                                </Stepper>

                            </Container>
                        </Box>
                    </Box>
            </main>
        </>
    )
}
