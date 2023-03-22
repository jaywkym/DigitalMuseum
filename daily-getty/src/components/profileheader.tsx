import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseFriends, DatabaseUser } from '@/types/FirebaseResponseTypes';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Avatar, Chip, Stack } from '@mui/material';
import { Container } from '@mui/system';
import { useFollowUser, useFollowing } from '@/pages/database/profile';

const ProfileHeader = ({user}) => {

    const {data: session, status} = useSession();

    const session_user: DatabaseUser = session? session.user as DatabaseUser : {} as DatabaseUser;

    const [following, followingLoading, getFollowing] = useFollowing(user.id)
    const [sFollowing, sFollowingLoading, sGetFollowing] = useFollowing(session_user.id)
    const [addSuccess, addLoading, followUser] = useFollowUser(session_user.id, user.id)
    const [isFollowing, setIsFriend] = useState(false)
    const selfAccount = session_user.id === user.id

    useEffect(() => {
        getFollowing()
        .catch(console.error)

        sGetFollowing()
        .catch(console.error)
    }, [user.id, session_user.id])

    useEffect(() => {

            let foundFriend = false;

            if(!sFollowing)
                return;

            sFollowing.forEach(friend => {
                
                if(friend == session_user.id ||
                    friend == user.id) {
                    foundFriend = true
                    return;
                }
                   
            })
    
            setIsFriend(foundFriend)

    }, [following, user, sFollowing])

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
                    {!followingLoading && <Chip label={`Following ${following? following.length: 0}`} />}
                    {!selfAccount && <Chip label={isFollowing? 'unfollow' : 'follow'} variant="outlined" onClick={() => {
                        if(!isFollowing)
                            followUser()
                        
                        // TODO - Remove as following

                        .then(sGetFollowing)
                    }} />}
                </Stack>
            </Box>
        </Container>
    );
};

export default ProfileHeader;
