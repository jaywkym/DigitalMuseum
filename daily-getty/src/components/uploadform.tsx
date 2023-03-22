import * as React from 'react';
import { green } from '@mui/material/colors';
import { display } from '@mui/system';
import Box from '@mui/material/Box';
import { useState, useEffect, useMemo } from 'react';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, RadioGroup, TextField, Radio, Button, CircularProgress, ImageList } from '@mui/material';
import { Container } from '@mui/system';
import { Modal, Typography } from '@mui/material';
import Image from 'next/image';
import useImage from '@/pages/dalle/images';
import useAddPost from '@/pages/database/createPostFront';
import Loading from './loading';
import setImage from '@/pages/dalle/images';
import setLoading from "@/pages/dalle/images";
import { useSession } from 'next-auth/react'
import type {
    DatabasePost,
} from "../../types/FirebaseResponseTypes";


const MuseForm = () => {

    const ref1 = React.createRef();
    const ref2 = React.createRef();
    const ref3 = React.createRef();


    const [value, setValue] = React.useState(''); //VALUE OF RADIO GROUP
    const [generate, setGenerate] = React.useState(false); //SUCCESS IN GENERATING ARTWORK

    const [test1, settest1] = useState('')
    const [test2, settest2] = useState('')
    const [prompt, setPrompt] = React.useState('');

    const timer = React.useRef<number>();

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    const handleButtonClick = () => {
        setGenerate(true);
    };

    const handleClose = () => {
        setGenerate(false);
    };

    useMemo(() => {
        console.log("CCLICKED")
    }, [test1, test2])



    //DallE API CALL

    const [b64_image1, b64_image2, b64_image3, created1, created2, created3, error, loadingImage, generateImage] = useImage(prompt, "3"); //INCORPORATE ERROR HANDLING



    const { data: session, status } = useSession()

    let user_id = status === 'authenticated' ? (session.user as any).id : "";

    let createdStatic;

    const [b64, setB64] = React.useState('');
    const [created, setCreated] = React.useState();
    const [generatePost] = useAddPost(b64, user_id, prompt, created);



    console.log(loadingImage);
    console.log(error)



    const imageClick = (event) => {


        let splitB64 = event.target.src.split(',')[1];
        setB64(splitB64);

        createdStatic = event.target.id;
        setCreated(createdStatic);

        const uploadInfo: DatabasePost = {
            id: null,
            user_id: user_id,
            userPrompt: prompt,
            givenPrompt: null,
            likes: 0,
            image: {
                created: createdStatic as Number,
                b64: splitB64 as String
            } as any
        }

        const request = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadInfo)
        }

        fetch('/api/database/posts/createPost', request)
            .then(res => res.json())
            .then(resj => {
                console.log("good!")
            })

    };

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
    };

    return (
        <Box>
            <Box sx={{ m: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <Container fixed>
                    <FormControl>
                        <FormLabel id="prompt" color='info'>Prompt of the Day</FormLabel>
                        <TextField id="prompt-answer" label="Answer the prompt!" variant="filled" placeholder="Enter Prompt" multiline rows={4} fullWidth required onChange={(e) => { setPrompt(e.target.value) }} />
                        <FormHelperText id="prompt-helper" color='info'>Limit your answer to 100 words or less.</FormHelperText>
                    </FormControl>
                </Container>
            </Box>
            {/*
            <Box sx={{ m: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <Container fixed>
                    <FormControl>
                        <FormLabel id="art-style">Choose an art style</FormLabel>
                        <RadioGroup
                            aria-labelledby="art-style-radio"
                            name="art-style-radio"
                            value={value}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="realism" control={<Radio />} label="Realism" />
                            <FormControlLabel value="animated" control={<Radio />} label="Animated" />
                            <FormControlLabel value="pop art" control={<Radio />} label="Pop Art" />
                            <FormControlLabel value="abstract" control={<Radio />} label="Abstract" />
                            <FormControlLabel value="retro" control={<Radio />} label="Retro" />
                        </RadioGroup>
                    </FormControl>
                </Container>
            </Box>
            */}

            {loadingImage ?
                <Loading>
                    <Image id="1" alt="image" height={500} width={500} src='/placeholder.png'></Image>
                </Loading>
                :
                <Image id={created1} alt="image" height={500} width={500} src={b64_image1} onClick={imageClick}></Image>

            }
            {loadingImage ?
                <Loading>
                    <Image id="2" alt="image" height={500} width={500} src='/placeholder.png'></Image>
                </Loading>
                :
                <Image id={created2} alt="image" height={500} width={500} src={b64_image2} onClick={imageClick}></Image>

            }
            {loadingImage ?
                <Loading>
                    <Image id="3" alt="image" height={500} width={500} src='/placeholder.png'></Image>
                </Loading>
                :
                <div>
                    <Image id={created3} alt="image" height={500} width={500} src={b64_image3} onClick={imageClick}></Image>
                </div>


            }

            <Box sx={{ m: 5 }}>
                <Container fixed>
                    <Button variant="contained" color="success" onClick={generateImage}>
                        Generate Muse
                    </Button>
                    {/*IMAGE GENERATED MODAL 
                    */}
                    <Modal
                        open={generate}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Your Muse of the Day
                            </Typography>
                            <Container>
                                {/* <div onClick={imageClick}><Image alt="image1" height={500} width={500} src={b64_image1}></Image></div>
                                    <div onClick={imageClick}><Image alt="image2" height={500} width={500} src={b64_image2}></Image></div>
                                    <div onClick={imageClick}><Image alt="image3" height={500} width={500} src={b64_image3}></Image></div>                     */}
                            </Container>
                        </Box>
                    </Modal>
                    {loadingImage && (
                        <CircularProgress
                            size={68}
                            sx={{
                                color: green[500],
                                position: 'absolute',
                                top: -6,
                                left: -6,
                                zIndex: 1,
                            }}
                        />
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default MuseForm;
