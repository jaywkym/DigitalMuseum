import * as React from 'react';
import useImage from './dalle/images';
import Head from 'next/head'
import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Image from 'next/image';
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { FormControl, FormControlLabel, FormHelperText, FormLabel, RadioGroup, TextField, Radio, Button, CircularProgress } from '@mui/material';
import { Container } from '@mui/system';

export default function NewMuse() {
    const [value, setValue] = React.useState(''); //VALUE OF RADIO GROUP
    const [loading, setLoading] = React.useState(false); //Loading ARTWORK
    const [success, setSuccess] = React.useState(false); //SUCCESS IN GENERATING ARTWORK
    const timer = React.useRef<number>();
    const [prompt, setPrompt] = React.useState('');
    const [b64_image, error, loading1, generateImage] = useImage(prompt, "1");

    console.log(b64_image);

    React.useEffect(() => {
        return () => {
            clearTimeout(timer.current);
        };
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value);
    };

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            },
        }),
    };

    // const handleButtonClick = () => {
    //     if (!loading) {
    //         setSuccess(false);
    //         setLoading(true);
    //         timer.current = window.setTimeout(() => {
    //             setSuccess(true);
    //             setLoading(false);
    //         }, 2000);
    //     }
    // };

    return (
        <>
            <Head>
                <title>Home Feed</title>
            </Head>
            <main>
                <Box sx={{ flexGrow: 1 }}>
                    <CssBaseline />
                    <Container fixed>
                        <h1 color='white'>
                            Prompt of the Day!
                        </h1>
                        <FormControl>
                            <FormLabel id="prompt" color='info'>Prompt of the Day</FormLabel>
                            <TextField id="prompt-answer" onChange={ (e) => {setPrompt(e.target.value)} } label="Answer the prompt!" variant="filled" placeholder="Enter Prompt" multiline rows={4} fullWidth required />
                            <FormHelperText id="prompt-helper" color='info'>Limit your answer to 100 words or less.</FormHelperText>
                        </FormControl>
                    </Container>
                    <Container fixed>
                        <FormControl>
                            {/* <FormLabel id="art-style">Choose an art style</FormLabel> */}
                            <RadioGroup
                                aria-labelledby="art-style-radio"
                                name="art-style-radio"
                                value={value}
                                onChange={handleChange}
                            >
                                {/* <FormControlLabel value="realism" control={<Radio />} label="Realism" />
                                <FormControlLabel value="animated" control={<Radio />} label="Animated" />
                                <FormControlLabel value="pop art" control={<Radio />} label="Pop Art" />
                                <FormControlLabel value="abstract" control={<Radio />} label="Abstract" />
                                <FormControlLabel value="retro" control={<Radio />} label="Retro" /> */}
                            </RadioGroup>
                        </FormControl>
                    </Container>
                    <Container fixed>
                        <Button variant="contained" color="success" onClick={generateImage}>
                            Submit Prompt for Your Muse!
                        </Button>
                        {loading && (
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
                    <br>
                    </br>
                    <Container>
                        <Image alt="image" height={500} width={500} src={b64_image}></Image>
                    </Container>
                    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                        <BottomNavigation
                            showLabels
                            value={value}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                        >
                            <Link href="/homefeed">
                                <BottomNavigationAction label="Feed" icon={<HomeIcon />} />
                            </Link>
                            <Link href="/newmuse">
                                <BottomNavigationAction label="Make a Muse" icon={<AddAPhotoIcon />} />
                            </Link>
                            <Link href="/profile">
                                <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
                            </Link>
                        </BottomNavigation>
                    </Paper>
                </Box>
            </main>
        </>
    )
}
