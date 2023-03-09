import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Container } from '@mui/system';
import generatePrompt from './generateprompt';

const Prompt = () => {

    const [randomPrompt, setRandomPrompt] = useState(null);

    useEffect(() => {
        async function fetchRandomLine() {
            const line = await generatePrompt();
            setRandomPrompt(line);
        }
        fetchRandomLine();
    }, []);

    if (!randomPrompt) {
        return <Typography variant="h1">Loading Prompt</Typography>;
    }

    return (
        <Box sx={{ m: 5 }}>
            <Container fixed>
                <Box sx={{ m: 5 }}>
                    <Typography variant="h5">Prompt of the Day</Typography>
                </Box>
                <Box>
                    <Typography variant="h6">What is your spirit animal? Mythical Animals Count!</Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Prompt;
