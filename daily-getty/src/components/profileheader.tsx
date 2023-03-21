import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseFriends, DatabaseUser } from '@/types/FirebaseResponseTypes';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Avatar, Chip, Stack } from '@mui/material';
import { Container } from '@mui/system';
import { useAddFriend, useFriends } from '@/pages/database/profile';

const ProfileHeader = ({user}) => {

    const {data: session, status} = useSession();

    const session_user: DatabaseUser = session? session.user as DatabaseUser : {} as DatabaseUser;

    const [friends, loading, getFriends] = useFriends(user.id)
    const [myFriends, myFloading, getMyFriends] = useFriends(user.id)
    const [addSuccess, addLoading, addFriend] = useAddFriend(session_user.id, user.id)
    const [isFriend, setIsFriend] = useState(true)

    // console.log({
    //     current_user: session_user,
    //     profile_user: user,
    //     isFriend: isFriend,
    //     addSuccess: addSuccess,
    //     addLoading: addLoading
    // })

    useEffect(() => {
        getFriends()
        getMyFriends()
    }, [user.id, addLoading])

    useMemo(() => {
        // console.log(friends)
        if(friends) {
            let foundFriend = false;
            myFriends.forEach(friend => {
                    console.log({
                        friend: friend,
                        session_user: session_user.id,
                        user: user.id
                    })
                if(friend === session_user.id ||
                    friend === user.id ||
                    user.id == session_user.id) {
                    foundFriend = true
                    return;
                }
                   
            })
    
            setIsFriend(foundFriend)

        }
    }, [friends, myFriends])

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
                    {!loading && <Chip label={`Following ${friends.length}`} />}
                    {!isFriend && <Chip label="Follow" variant="outlined" onClick={() => {
                        addFriend()
                        .then(getFriends)
                    }} />}
                </Stack>
            </Box>
        </Container>
    );
};

export default ProfileHeader;
