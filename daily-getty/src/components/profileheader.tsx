import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseFriends, DatabaseUser } from '@/types/FirebaseResponseTypes';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Avatar, Chip, Stack } from '@mui/material';
import { Container } from '@mui/system';
import { useFriends } from '@/pages/database/profile';

const ProfileHeader = ({user}) => {

    const [friends, loading, setFriends] = useFriends(user.id)

    useEffect(() => {
        setFriends()
    }, [user.id])

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
                    <Chip label={`Friends ${friends.length}`} />
                    {/* <Chip label="Following 312" variant="outlined" /> // Took out this since we only have capabilities for friends */}
                </Stack>
            </Box>
        </Container>
    );
};

export default ProfileHeader;
