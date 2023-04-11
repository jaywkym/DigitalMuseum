import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import Image from 'next/image';
import NavBar from '@/src/components/navbar';
import { useSession } from 'next-auth/react';
import useScreenSize from './database/pages';
import { Alert, Button, CircularProgress, Container, FormControl, InputLabel, Link, MenuItem, MobileStepper, Paper, Select, Slide, SlideProps, Snackbar, Step, StepLabel, Stepper, TextField, Typography, useTheme } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import generatePrompt from '@/src/components/generateprompt';
import useImage from './dalle/images';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { DatabasePost, DatabaseUser } from '@/types/FirebaseResponseTypes';
import { green } from '@mui/material/colors';
import SwipeableViews from 'react-swipeable-views';

const MAX_INPUT_CHARACTER_COUNT = 100;

type Step = {
    label: string;
}

export default function NewMuse() {

    const { data: session, status } = useSession();
    const [isXS, isSM, isMD, isLG, isXL] = useScreenSize();
    const [activeStep, setActiveStep] = useState(0);

    const [ImageExist, doesImageExist] = useState(true);

    const [prompt, setPrompt] = useState('')
    const [userResponse, setUserResponse] = useState('');
    const [artStyle, setArtStyle] = useState('');

    const [image_urls, created, images_success, images_loading, error, generateImage] = useImage(userResponse, artStyle, "3");
    const [imageActiveStep, setImageActiveStep] = useState(0);
    const maxSteps = 3;

    const [hoveringImage, setHoveringImage] = useState(false);

    const [imageSaving, setImageSaving] = useState(false);

    const inputContainerRef = useRef(null);
    const theme = useTheme();

    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;

    const [userResponseError, setUserResponseError] = useState(false);
    const userResponseOK = activeStep == 0 && userResponse.length > 0 && userResponse.length <= MAX_INPUT_CHARACTER_COUNT;
    const artStyleOK = activeStep == 1 && artStyle !== '';
    const imageSelectedOK = activeStep == 2 && image_urls.length > 0 && images_success && !images_loading;

    useEffect(() => {

        let user_id = status === 'authenticated' ? (user as any).id : "";

        if(user_id == ""){
            return;
        }
        
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
    
        const post_id = year + "_" + month + "_" + day;
    
        const uploadInfo = {
            post_id: post_id,
            user_id: user_id
        }
    
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadInfo)
        }
    
        fetch('/api/database/posts/checkPostExist', request)
            .then(res => res.json())
            .then(resj => {
                    doesImageExist(resj.exist);
            })
            .catch(console.error)
    
      }, [user]);

    const handleNext = () => {

        if(activeStep === 0) {
            if(!userResponseOK) {
                setUserResponseError(true)
                return;
            }
        }

        if(activeStep === 1) {
            if(!artStyleOK) {
                setUserResponseError(true)
                return
            }

            if(artStyle === undefined ||
               artStyle === '') {
                //ERROR
                return
            }
            
            generateImage()
            .catch(console.error)
        }

        else if(activeStep === 2) {

            const imageSelected = imageActiveStep

            if(imageSelected < 0 || imageSelected > 2) {
                // ERROR
                return
            }

            const selected_url = image_urls[imageSelected];

            const uploadInfo: DatabasePost = {
                id: null,
                user_id: user.id,
                userPrompt: userResponse,
                givenPrompt: prompt,
                likes: [],
                comments: null,
                image: {
                    created: Date.now(),
                    url: selected_url
                } as any
            }
            const request = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadInfo)
            }

            setImageSaving(true);
    
            fetch('/api/database/posts/createPost', request)
                .then(res => res.json())
                .then(resj => {
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                })
                .catch(console.error)
                .finally(() => setImageSaving(false))
            return
        }

        handleAlertClose()
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    };

  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      handleAlertClose()
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };

    const handleNextImage = () => {
        setImageActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBackImage = () => {
        setImageActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleImageStepChange = (step: number) => {
        setImageActiveStep(step);
    };

    const steps: Step[] = [
        {label: 'Answer prompt'},
        {label: 'Select Art Style'},
        {label: 'Select Image'},
        {label: 'See Post'}
    ]

    useEffect(() => {
        generatePrompt()
        .then(setPrompt)
        .catch(console.error)
    }, [])

    function handleAlertClose() {
        setUserResponseError(false)
    }

    function AlertTransition(props) {
        return <Slide {...props} direction="up" />;
    }

    const testURL = 'https://dailymuse.s3.us-east-2.amazonaws.com/7d8284fb-565c-4d84-8327-e80bb38d1722_2023_4_4'

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
                <NavBar isMobile={isXS} session={session} />
                <Snackbar 
                    open={userResponseError} 
                    autoHideDuration={6000} 
                    TransitionComponent={AlertTransition}

                >
                    <Alert 
                        severity="warning"
                        onClose={handleAlertClose}
                    >
                        {activeStep === 0 && 'Write your response first before moving on'}
                        {activeStep === 1 && 'Please choose an art style'}

                    </Alert>
                </Snackbar>

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
                                variant={'h3'}
                                color={'common.blueScheme.notWhite'}
                            >
                                Generate New Muse!
                            </Typography>
                        </Box>

                        { !ImageExist &&
                        <Container
                            sx={{
                                width: '95%', 
                                backgroundColor: 'common.blueScheme.foreground',
                                boxShadow: '3px 3px 6px 6px',
                                padding: 5,
                                display: 'flex',
                                flexDirection: 'column',

                            }}

                            ref={inputContainerRef}
                        >
                            <Box>
                                <Typography variant={'h4'} color={'common.blueScheme.notWhite'} paddingBottom={2}>
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
                                    <Box 
                                        display={'flex'} 
                                        flexDirection={'column'}
                                        width={'100%'}
                                    >
                                        <TextField
                                            id="prompt-field"
                                            label="Place Response here"
                                            sx={{backgroundColor: 'common.blueScheme.notWhite'}}
                                            size={'medium'}
                                            fullWidth
                                            multiline
                                            onChange={(e) => {
                                                setUserResponse(e.target.value)
                                                handleAlertClose()
                                            }}
                                            value={userResponse}
                                            placeholder='Like a spoon in the wind...'
                                            inputProps={{ maxLength: MAX_INPUT_CHARACTER_COUNT }}
                                        ></TextField>
                                        <Typography color={'common.blueScheme.notWhite'} paddingTop={1}>
                                            {MAX_INPUT_CHARACTER_COUNT - userResponse.length} characters left
                                        </Typography>
                                    </Box>
                                   
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
                                        onChange={(e) => {
                                            setArtStyle(e.target.value)
                                            handleAlertClose()
                                        }}
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



{                                   activeStep === 2 &&
                                <Box
                                    display={'flex'}
                                    alignContent={'center'}
                                    justifyContent={'center'}
                                    width={'100%'}
                                >
                                    {
                                        images_loading &&
                                        <Box
                                            display={'flex'}
                                            flexDirection={'column'}
                                            alignContent={'center'}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            justifyItems={'center'}
                                        >
                                            <Typography 
                                                textAlign={'center'} 
                                                color={'common.blueScheme.notWhite'} 
                                                variant={'h5'} 
                                                paddingBottom={3}
                                            >
                                                Generating images! This may take up to 2 minutes to complete.
                                            </Typography>
                                            <CircularProgress
                                                size={68}
                                                sx={{
                                                    color: green[500],
                                                }}

                                                
                                            />
                                            
                                        </Box>

                                    }
                                    {
                                        imageSaving &&
                                        <Box
                                            display={'flex'}
                                            flexDirection={'column'}
                                            alignContent={'center'}
                                            justifyContent={'center'}
                                            alignItems={'center'}
                                            justifyItems={'center'}
                                        >
                                            <Typography 
                                                textAlign={'center'} 
                                                color={'common.blueScheme.notWhite'} 
                                                variant={'h5'} 
                                                paddingBottom={3}
                                            >
                                                Uploading Muse! This may take up to 2 minutes to complete.
                                            </Typography>
                                            <CircularProgress
                                                size={68}
                                                sx={{
                                                    color: green[500],
                                                }}
                                            />
                                            
                                        </Box>

                                    }
                                    {
                                    !images_loading && images_success && !imageSaving && 
                                    <Box sx={{ flexGrow: 1, maxWidth: '400px'}}>
                                        <Paper
                                            square
                                            elevation={0}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                height: 50,
                                                pl: 2,
                                                bgcolor: 'common.blueScheme.background',
                                            }}
                                        >
                                            <Typography variant={'body1'} color={'common.blueScheme.notWhite'}>{'Post your selection!'}</Typography>
                                        </Paper>
                                        <SwipeableViews
                                            axis={'x'}
                                            index={imageActiveStep}
                                            onChangeIndex={handleImageStepChange}
                                            enableMouseEvents
                                        >
                                            {image_urls.map((url, index) => (
                                            <Box key={url}>
                                                {Math.abs(imageActiveStep - index) <= 2 ? (
                                                <Image
                                                    // fill
                                                    src={`data:image/png;base64, ${url}`}
                                                    width={1000}
                                                    height={1000}
                                                    alt={`image ${1}`}
                                                    style={{
                                                        cursor: hoveringImage? 'pointer' : 'auto',
                                                        height: '100%',
                                                        width: '100%'
                                                    }}

                                                    onMouseEnter={() => setHoveringImage(true)}
                                                    onMouseLeave={() => setHoveringImage(false)}
                                                />
                                                ) : null}
                                            </Box>
                                            ))}
                                            
                                        </SwipeableViews>
                                        <MobileStepper
                                            steps={maxSteps}
                                            position="static"
                                            activeStep={imageActiveStep}
                                            sx={{backgroundColor: 'common.blueScheme.background'}}
                                            nextButton={
                                            <Button
                                                size="small"
                                                onClick={handleNextImage}
                                                disabled={imageActiveStep === maxSteps - 1}
                                                sx={{color: 'common.blueScheme.notWhite'}}
                                            >
                                                Next
                                                {theme.direction === 'rtl' ? (
                                                <KeyboardArrowLeft />
                                                ) : (
                                                <KeyboardArrowRight />
                                                )}
                                            </Button>
                                            }
                                            backButton={
                                            <Button 
                                                size="small" 
                                                onClick={handleBackImage} 
                                                disabled={imageActiveStep === 0}
                                                sx={{color: 'common.blueScheme.notWhite'}}
                                            >
                                                {theme.direction === 'rtl' ? (
                                                <KeyboardArrowRight />
                                                ) : (
                                                <KeyboardArrowLeft />
                                                )}
                                                Back
                                            </Button>
                                            }
                                        />
                                        </Box>
                                    }
                                    </Box>
                                }
                                {
                                    activeStep === 3 &&
                                    <Slide
                                        direction={activeStep === 3? 'left' : 'right'}
                                        in={activeStep === 3}
                                        container={inputContainerRef.current}
                                        mountOnEnter
                                        unmountOnExit
                                    >
                                    <Box width={'100%'}>
                                        <Alert variant="outlined" severity="success">
                                            Success: Muse has been posted — Go to your profile to check it out!
                                        </Alert>
                                    </Box>
                                    </Slide>

                                }
                                <Box>
                                </Box>
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
                                         !isXS && activeStep === 1 && <Typography>Edit Response</Typography>
                                    }
                                </Button>
                                { !images_loading && !imageSaving &&
                                <Button onClick={handleNext} sx={{margin: '40px 0'}}>
                                    {
                                         !isXS && activeStep === 0 && <Typography>Select Art Style</Typography>
                                    }{
                                        !isXS && activeStep === 1 && <Typography>Generate Images</Typography>
                                    }{
                                        !isXS && activeStep === 2 && <Typography>Post Image</Typography>
                                    }{
                                        !isXS && activeStep === 3 && <Link href={'/profile'} underline="none"><NavigateNextIcon /><Typography>See Image</Typography></Link>
                                    }{
                                        isXS && activeStep === 3 && <Link href={'/profile'} underline="none"><NavigateNextIcon /></Link>
                                    }{
                                        activeStep !== 3 && <NavigateNextIcon />
                                    }
                                        
                                </Button>
                                }

                            </Box>
                            <Stepper activeStep={activeStep} orientation={'horizontal'} sx={{width: '100%'}} alternativeLabel>
                                {steps.map((step, index) => (
                                    <Step key={step.label} sx={{color: 'white'}}>
                                        <StepLabel>
                                            {   
                                                !isXS &&
                                                <Typography sx={{color: 'white'}}>
                                                    {step.label}
                                                </Typography>

                                            
                                            }   
                                        </StepLabel>
                                        </Step>
                                    
                                ))}
                            </Stepper>

                        </Container>
                        }
                        {
                            ImageExist &&
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
                                    Seems Like You Already Posted Today!
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant={'h3'} color={'common.blueScheme.notWhite'} paddingBottom={2}>
                                  Come Back Tomorrow!
                                </Typography>
                            </Box>



                        </Container>

                        }
                    </Box>
                </Box>
            </main>
        </>
    )
}