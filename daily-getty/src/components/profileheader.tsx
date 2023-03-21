import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseUser } from '@/types/FirebaseResponseTypes';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Avatar, Chip, Stack } from '@mui/material';
import { Container } from '@mui/system';

const ProfileHeader = ({user}) => {

    return (
        <Container fixed >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <Box sx={{ m: 5 }}>
                    <Typography variant='h3'>
                        Hey, {user.name}!
                    </Typography>
                </Box>
                <Box sx={{ marginBottom: 5 }}>
                    <Avatar
                        alt="placeholder"
                        src={user.image}
                        sx={{ width: 128, height: 128 }}
                    />
                </Box>
                <Stack direction="row" spacing={1}>
                    <Chip label="Followers 218" />
                    <Chip label="Following 312" variant="outlined" />
                </Stack>
            </Box>
        </Container>
    );
};

export default ProfileHeader;
