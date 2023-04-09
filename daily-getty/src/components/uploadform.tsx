import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import React, { useState, useEffect, useMemo } from 'react';
import { 
    FormControl, 
    FormControlLabel, 
    FormHelperText, 
    FormLabel, 
    RadioGroup, 
    TextField, 
    Radio, 
    Button, 
    CircularProgress, 
    ImageList, 
    ImageListItem 
} from '@mui/material';
import { Container } from '@mui/system';
import { Modal, Typography } from '@mui/material';
import Image from 'next/image';
import useImage from '@/pages/dalle/images';
import useAddPost from '@/pages/database/createPostFront';
import Loading from './loading';
import { useSession } from 'next-auth/react'
import type {
    CommentsResponse,
    DatabasePost,
} from "../../types/FirebaseResponseTypes";
import generatePrompt from './generateprompt';


const MuseForm = () => {

    //ART STYLE FORM
    const [artStyle, setArtStyle] = useState(''); //VALUE OF RADIO GROUP
    
    //DallE API CALL
    const [prompt, setPrompt] = useState(''); //PROMPT TO GENERATE IMAGE
    const [style, setStyle] = useState(null);

    //GENERATE PROMPT
    const [question, setQuestion] = useState('');

    const [image_urls, created, loading, error, generateImage] = useImage(prompt, style, "1");
    const { data: session, status } = useSession()
    const [completed, setCompleted] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setArtStyle((event.target as HTMLInputElement).value);
    };
   
    const user_id = status === 'authenticated' ? (session.user as any).id : "";
    const createdNum = created == ''? 0 : parseInt(created)

    const changePrompting = (event) => {
        setStyle(" created in the style of " + event.target.value)
    }

    const imageClick = (event) => {

        const id = parseInt(event.target.id);

        const uploadInfo: DatabasePost = {
            id: null,
            user_id: user_id,
            userPrompt: prompt,
            givenPrompt: question,
            comments: {} as CommentsResponse,
            likes: [],
            image: {
                created: createdNum,
                url: image_urls[id]
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
                setCompleted(true);
            })
    };


    //MODAL STATES
    const [generate, setGenerate] = useState(false); //SUCCESS IN GENERATING ARTWORK

    const handleButtonClick = () => {
        setGenerate(true); //Open Modal
        // generateImage(); //Generate Image
    };


    const handleClose = () => {
        setGenerate(false); //Closes Modal
    };

    console.log(loading)


    useEffect(() => {

        //QUESTION
        generatePrompt()
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

                {/*IMAGE GENERATED MODAL*/}
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
                                {
                                    (loading && (
                                        <CircularProgress
                                            size={68}
                                            sx={{
                                                color: green[500],
                                                zIndex: 1,
                                            }}
                                        />
                                    ))
                                }

                                <ImageList sx={{ height: '70vh' }}>
                                    {

                                        !loading && image_urls.map((url, index) => (
                                            <React.Fragment key={index}>
                                                <ImageListItem>
                                                    <Loading>
                                                        <Image id={index + '_loading'} alt="image 1" height={500} width={500} src='/placeholder.png'></Image>
                                                    </Loading>
                                                </ImageListItem>
                                            
                                                    :
                                            
                                                <ImageListItem>
                                                    <Image id={index.toString()} alt="image 1 source" height={500} width={500} src={url} onClick={imageClick}></Image>
                                                </ImageListItem>
                                            </React.Fragment>
                                            
                                        ))
                                    
                                    }

                                </ImageList>
                            </Box>
                        </Container>
                    </Box>
                    </Modal>
                    
                    
            </Container >
        );
    }
};


export default MuseForm;