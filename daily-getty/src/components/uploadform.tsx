import * as React from 'react';
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import { useState, useEffect, useMemo } from 'react';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, RadioGroup, TextField, Radio, Button, CircularProgress, ImageList, ImageListItem } from '@mui/material';
import { Container } from '@mui/system';
import { Modal, Typography } from '@mui/material';
import Image from 'next/image';
import useImage from '@/pages/dalle/images';
import useAddPost from '@/pages/database/createPostFront';
import Loading from './loading';
import { useSession } from 'next-auth/react'
import type {
    DatabasePost,
} from "../../types/FirebaseResponseTypes";
import generatePrompt from './generateprompt';


const MuseForm = () => {
    const ref1 = React.createRef();
    const ref2 = React.createRef();
    const ref3 = React.createRef();


    const [test1, settest1] = useState('')
    const [test2, settest2] = useState('')

    const timer = React.useRef<number>();
    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);


    //ART STYLE FORM
    const [artStyle, setArtStyle] = React.useState(''); //VALUE OF RADIO GROUP
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setArtStyle((event.target as HTMLInputElement).value);
    };


    useMemo(() => {
        console.log("CCLICKED")
    }, [test1, test2])


    //DallE API CALL
    const [prompt, setPrompt] = React.useState(''); //PROMPT TO GENERATE IMAGE
    const [style, setStyle] = React.useState(null);


    //GENERATE PROMPT
    const [question, setQuestion] = React.useState('');

    const [b64_image1, b64_image2, b64_image3, created1, created2, created3, error, loadingImage1, loadingImage2, loadingImage3, generateImage] = useImage(prompt, style, "1"); //INCORPORATE ERROR HANDLING
    const { data: session, status } = useSession()
    let user_id = status === 'authenticated' ? (session.user as any).id : "";
    let createdStatic;
    const [b64, setB64] = React.useState('');
    const [created, setCreated] = React.useState();
   

    const [generatePost] = useAddPost(b64, user_id, prompt, created);
    //console.log(loadingImage);
    console.log(error)


    const [completed, setCompleted] = React.useState(false);

    //IMAGE SELECTION
    const [selected, setSelected] = React.useState(false);

    const changePrompting = (event) => {
        console.log(event.target.value)
        setStyle(" created in the style of " + event.target.value)
    }

    const imageClick = (event) => {
        let splitB64 = event.target.src.split(',')[1];
        setB64(splitB64);


        createdStatic = event.target.id;
        setCreated(createdStatic);

        // console.log(question);

        const uploadInfo: DatabasePost = {
            id: null,
            user_id: user_id,
            userPrompt: prompt,
            givenPrompt: question,
            likes: [],
            image: {
                created: createdStatic as Number,
                b64: splitB64 as String
            } as any
        }

        // console.log(uploadInfo);

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
                setCompleted(true);
            })
    };


    //MODAL STATES
    const [generate, setGenerate] = React.useState(false); //SUCCESS IN GENERATING ARTWORK

    const handleButtonClick = () => {
        setGenerate(true); //Open Modal
        //setPrompt(prompt + " created in the style of " + artStyle); //Update Prompt with Artstyle Value
        generateImage(); //Generate Image
    };


    const handleClose = () => {
        setGenerate(false); //Closes Modal
    };


    useEffect(() => {


        //QUESTION
        const theQuestion = generatePrompt()
             .then(setQuestion)
             .catch(console.error);
    }, [])


    if (completed) {
        return (
            <Container fixed>
                <Box sx={{ m: 10, p: 5, display: 'flex', bgcolor: '#FFFFFF', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <Typography component="h1" variant="h3">
                        Thanks For The Post! Come Back Tomorrow To Post Again!
                    </Typography>

                </Box>
            </Container>
        );
    }
    else {
        return (
            <Container fixed>
                {/*Prompt Header*/}
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <Box sx={{ m: 5 }}>
                        <Typography variant="h3">Prompt of the Day</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">{question}</Typography>
                    </Box>
                </Box>
                {/*Answer Form (Text + Art Style Radio)*/}
                <Box sx={{ m: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignContent: 'space-between', alignItems: 'space-between', p: 5 }}>
                    {/*Art Style*/}
                    <FormControl>
                        <FormLabel id="prompt" color='info'>Your Muse in Words</FormLabel>
                        <TextField id="prompt-answer" label="Answer the prompt!" variant="filled" placeholder="Enter Prompt" multiline rows={4} fullWidth required onChange={(e) => { setPrompt(e.target.value) }} />
                        <FormHelperText id="prompt-helper" color='info'>Limit your answer to 100 words or less.</FormHelperText>
                    </FormControl>
                    {/*Art Style*/}
                    <FormControl>
                        <FormLabel id="art-style">Choose an art style</FormLabel>
                        <RadioGroup
                            aria-labelledby="art-style-radio"
                            name="art-style-radio"
                            value={artStyle}
                            onChange={handleChange}
                        >
                            <FormControlLabel value="realism" control={<Radio />} onClick={changePrompting} label="Realism" />
                            <FormControlLabel value="animated" control={<Radio />} onClick={changePrompting} label="Animated" />
                            <FormControlLabel value="pop art" control={<Radio />} onClick={changePrompting} label="Pop Art" />
                            <FormControlLabel value="abstract" control={<Radio />} onClick={changePrompting} label="Abstract" />
                            <FormControlLabel value="retro" control={<Radio />} onClick={changePrompting} label="Retro" />
                        </RadioGroup>
                    </FormControl>
                </Box>

                <Box sx={{ m: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <Button variant="contained" color="success" onClick={handleButtonClick}>
                        Generate Muse
                    </Button>
                </Box>

                {/*IMAGE GENERATED MODAL
                       */}
                <Modal
                    open={generate}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        pt: 2,
                        px: 4,
                        pb: 3,
                    }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Your Muse of the Day
                            </Typography>
                            <Typography variant="body1" component="h3">
                                Click on an image below to finalize your muse.
                            </Typography>
                        </Box>
                        <Container>
                            <Box sx={{ m: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', alignItems: 'center' }}>
                                <ImageList sx={{ height: '70vh' }}>
                                    {loadingImage1 && !selected ?
                                        <ImageListItem>
                                            <Loading>
                                                <Image id="1" alt="image" height={500} width={500} src='/placeholder.png'></Image>
                                            </Loading>
                                        </ImageListItem>
                                        :
                                        <ImageListItem>
                                            <Image id={created1} alt="image" height={500} width={500} src={b64_image1} onClick={imageClick}></Image>
                                        </ImageListItem>
                                    }
                                    {loadingImage2 && !selected ?
                                        <ImageListItem>
                                            <Loading>
                                                <Image id="2" alt="image" height={500} width={500} src='/placeholder.png'></Image>
                                            </Loading>
                                        </ImageListItem>
                                        :
                                        <ImageListItem>
                                            <Image id={created2} alt="image" height={500} width={500} src={b64_image2} onClick={imageClick}></Image>
                                        </ImageListItem>
                                    }
                                    {loadingImage3 && !selected ?
                                        <ImageListItem>
                                            <Loading>
                                                <Image id="3" alt="image" height={500} width={500} src='/placeholder.png'></Image>
                                            </Loading>
                                        </ImageListItem>
                                        :
                                        <ImageListItem>
                                            <Image id={created3} alt="image" height={500} width={500} src={b64_image3} onClick={imageClick}></Image>
                                        </ImageListItem>
                                    }

                                    {selected &&
                                        <Box sx={{ display: 'flex', flexDirection: 'column', m: 10, p: 5 }}>
                                            <Typography component="h1" variant="h4">
                                                Congratulations! You have posted your muse!
                                            </Typography>
                                            <Button onClick={handleClose}>
                                                Close
                                            </Button>
                                        </Box>
                                    }
                                </ImageList>
                            </Box>
                        </Container>
                    </Box>
                </Modal>
                {
                    (loadingImage1 && loadingImage2 && loadingImage3) && (
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
                    )
                }
            </Container >
        );
    }
};


export default MuseForm;