import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseFriends, DatabaseUser } from '@/types/FirebaseResponseTypes';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Avatar, Chip, Stack } from '@mui/material';
import { Container } from '@mui/system';
import { useAddFriend, useFriends } from '@/pages/database/profile';
import { Button, Modal, Grid, List } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ProfileHeader = ({ user }) => {

    const { data: session, status } = useSession();

    const session_user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;

    const [friends, loading, getFriends] = useFriends(user.id)
    const [myFriends, myFloading, getMyFriends] = useFriends(user.id)
    const [addSuccess, addLoading, addFriend] = useAddFriend(session_user.id, user.id)
    const [isFriend, setIsFriend] = useState(true)

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
        if (friends) {
            let foundFriend = false;
            myFriends.forEach(friend => {
                console.log({
                    friend: friend,
                    session_user: session_user.id,
                    user: user.id
                })
                if (friend === session_user.id ||
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
                    {!loading &&
                        <Button onClick={handleOpen}>
                            <Chip label={`Following ${friends ? friends.length : 0}`} />
                        </Button>}
                    {!isFriend && <Chip label="Follow" variant="outlined" onClick={() => {
                        addFriend()
                            .then(getFriends)
                    }} />}
                </Stack>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <List>
                            {friends.map((friend) => (
                                <li key={friend}>
                                    <Grid container alignItems="center">
                                        <Grid item sx={{ display: 'flex', width: 44 }}>
                                            <img src={user.image} width={'50%'} />
                                        </Grid>
                                        <Grid item sx={{ width: 'calc(100% - 44px)' }}>
                                            <Box
                                                key={user.id}
                                                component="span"
                                                sx={{ fontWeight: 'bold', color: 'black' }}
                                            >
                                                <p>{user.name}</p>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </li>))}
                        </List>
                    </Box>
                </Modal>
            </Box>
        </Container>
    );
};

export default ProfileHeader;
