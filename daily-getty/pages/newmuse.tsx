import React, { useState } from 'react';
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
import { Button, Step, StepLabel, Stepper, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

type Step = {
    label: string;
}

export default function NewMuse() {

    const { data: session, status } = useSession();
    const [isXS, isSM, isMD, isLG, isXL] = useScreenSize();
    const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };

    const steps: Step[] = [
        {
            label: 'Answer prompt'
        },
        {
            label: 'Choose Art Style'
        },
        {
            label: 'Choose Image'
        },

    ]

    

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
                <NavBar isMobile={isXS} session={session}/>
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
                        
                        <Box
                            display={'flex'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                            alignContent={'center'}
                        >
                            <Button onClick={handleNext}>
                                <NavigateBeforeIcon />
                            </Button>
                            <Button onClick={handleBack}>
                                <NavigateNextIcon />
                            </Button>

                        </Box>
                            <Stepper activeStep={activeStep} orientation={'horizontal'} sx={{width: '100%'}}>
                                {steps.map((step, index) => (
                                    <Step key={step.label} sx={{color: 'white'}}>
                                        <StepLabel
                                            optional={
                                                index === 3? (
                                                    <Typography>
                                                        Last step
                                                    </Typography>
                                                ) : null
                                            }
                                        >
                                            <Typography sx={{color: 'white'}}>
                                                {step.label}
                                            </Typography>

                                        </StepLabel>
                                        </Step>
                                    
                                ))}
                            </Stepper>

                        </Box>
                    </Box>
            </main>
        </>
    )
}
