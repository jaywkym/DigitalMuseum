import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseFriends, DatabaseUser } from '@/types/FirebaseResponseTypes';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Avatar, Chip, Stack } from '@mui/material';
import { Container } from '@mui/system';
import { useFollowUser, useFollowing } from '@/pages/database/profile';
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

    const [following, followingLoading, getFollowing] = useFollowing(user.id)
    const [sFollowing, sFollowingLoading, sGetFollowing] = useFollowing(session_user.id)
    const [addSuccess, addLoading, followUser] = useFollowUser(session_user.id, user.id)
    const [isFollowing, setIsFriend] = useState(false)
    const selfAccount = session_user.id === user.id

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        getFollowing()
            .catch(console.error)

        sGetFollowing()
            .catch(console.error)
    }, [user.id, session_user.id])

    useEffect(() => {

        let foundFriend = false;

        if (!sFollowing)
            return;

        sFollowing.forEach(friend => {

            if (friend == session_user.id ||
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
                    {!followingLoading && <Chip label={`Following ${following ? following.length : 0}`} />}
                    {!selfAccount && <Chip label={isFollowing ? 'unfollow' : 'follow'} variant="outlined" onClick={() => {
                        if (!isFollowing)
                            followUser()

                                // TODO - Remove as following

                                .then(sGetFollowing)
                    }} />}
                </Stack>
                {/*
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <List>
                            {sFollowing && sFollowing.map((friend) => (
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
                            */}
            </Box>
        </Container>
    );
};

export default ProfileHeader;


// {!loading &&
//     <Button onClick={handleOpen}>
//         <Chip label={`Following ${friends ? friends.length : 0}`} />
//     </Button>}
// {!isFriend && <Chip label="Follow" variant="outlined" onClick={() => {
//     addFriend()
//         .then(getFriends)