import { useState, useEffect, useMemo, forwardRef } from 'react';
import { useSession } from 'next-auth/react';
import { DatabaseFriends, DatabaseUser } from '@/types/FirebaseResponseTypes';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import { Avatar, Chip, Stack } from '@mui/material';
import { Container } from '@mui/system';
import { requestFriendsForUser, useFollowUser, useFollowers, useFollowing, useUnfollowUser } from '@/pages/database/profile';
import { Button, Modal, Grid, List } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Slide, { SlideProps } from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import Link from 'next/link';

const Transition = forwardRef(function Transition(
    props: SlideProps,
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

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

const ProfileHeader = ({ user, session }) => {

    const session_user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;

    const [followers, setFollowers] = useState([] as string[]);
    const [following, setFollowing] = useState([] as string[]);
    const [loadingFriends, setLoadingFriends] = useState(true);

    const [sFollowing, sFollowingLoading, sGetFollowing] = useFollowing(user.id)
    const [followSuccess, followLoading, followUser] = useFollowUser(session_user.id, user.id)
    const [unfollowSuccess, unfollowLoading, unfollowUser] = useUnfollowUser(session_user.id, user.id);
    const [isFollowing, setIsFriend] = useState(false)

    // sGetFollowing();

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const selfAccount = session_user.id === user.id
    const userNeedsUpdate = user.id === undefined;

    useEffect(() => {

        if (userNeedsUpdate)
            return;

        async function pullFriends() {

            setLoadingFriends(true);

            const dbFriends = await requestFriendsForUser(user.id)

            if (!dbFriends.success)
                return;

            setFollowers(dbFriends.friends.followers);
            setFollowing(dbFriends.friends.following)
            setLoadingFriends(false)

        }

        pullFriends()
            .catch(console.error)

    }, [userNeedsUpdate, followLoading, unfollowLoading])


    //FOLLOWERS/FOLLOWING MODAL
    const [followersOpen, setFollowersOpen] = useState(false);
    const [followingOpen, setFollowingOpen] = useState(false);

    const handleFollowersOpen = () => setFollowersOpen(true);
    const handleFollowersClose = () => setFollowersOpen(false);

    const handleFollowingOpen = () => setFollowingOpen(true);
    const handleFollowingClose = () => setFollowingOpen(false);

    useEffect(() => {

        async function checkFriendship() {

            let foundFriend = false;

            const dbFriends = await requestFriendsForUser(user.id)

            if (dbFriends)
                if (dbFriends.friends)
                    if (dbFriends.friends.followers)

                        dbFriends.friends.followers.forEach(friend => {
                            if (friend == session_user.id ||
                                friend == user.id) {
                                foundFriend = true
                            }
                        });

            setIsFriend(foundFriend)

        }

        checkFriendship()
            .catch(console.error)

    }, [following, followers, sFollowing, isFollowing])

    return (
        <Box
            sx={{
                backgroundColor: 'common.blueScheme.foreground',
                margin: 0,
                padding: 5,
                boxShadow: '5px 5px 5px 3px'
            }}

        >
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <Box sx={{ m: 0 }}>
                    <Typography
                        sx={{ fontSize: { xs: 25, sm: 40, md: 50, lg: 60 } }}
                        color={'common.blueScheme.notWhite'}
                        paddingBottom={3}
                    >
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
                    {!loadingFriends && <Chip
                        label={`Following ${following ? following.length : 0}`}
                        sx={{
                            backgroundColor: 'common.blueScheme.background',
                            color: 'common.blueScheme.notWhite',
                            border: '1px solid #222',
                        }}
                        onClick={handleFollowingOpen}
                    />}
                    {!loadingFriends && <Chip
                        label={`Followers ${followers ? followers.length : 0}`}
                        sx={{
                            backgroundColor: 'common.blueScheme.background',
                            color: 'common.blueScheme.notWhite',
                            border: '1px solid #222',
                        }}
                        onClick={handleFollowersOpen}
                    />}

                    {/* Followers Modal */}
                    <Dialog
                        open={followersOpen}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleFollowersClose}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{
                            style: {
                                borderRadius: 15,
                            },
                        }}
                    >
                        <DialogTitle
                            sx={{
                                backgroundColor: '#4a148c',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                borderRadius: '15px 15px 0 0',
                            }}
                        >
                            Followers
                        </DialogTitle>
                        <DialogContent
                            sx={{
                                backgroundColor: '#4a148c',
                                color: '#ffffff',
                                borderRadius: '0 0 15px 15px',
                            }}
                        >
                            {followers.map((followerId) => (
                                // Replace this with actual follower data
                                <Link key={followerId} href={`/profile/${followerId}`}>
                                    <DialogContentText>
                                        {/* Replace this with the actual follower name */}
                                        {followerId}
                                    </DialogContentText>
                                </Link>
                            ))}
                        </DialogContent>
                        <DialogActions sx={{ backgroundColor: '#4a148c', borderRadius: '0 0 15px 15px' }}>
                            <Button
                                onClick={handleFollowersClose}
                                sx={{
                                    color: '#4a148c',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '15px',
                                    border: '1px solid #ffffff',
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>

                    {/* Following Modal */}
                    <Dialog
                        open={followingOpen}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleFollowingClose}
                        maxWidth="sm"
                        fullWidth
                        PaperProps={{
                            style: {
                                borderRadius: 15,
                            },
                        }}
                    >
                        <DialogTitle
                            sx={{
                                backgroundColor: '#4a148c',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                borderRadius: '15px 15px 0 0',
                            }}
                        >
                            Following
                        </DialogTitle>
                        <DialogContent
                            sx={{
                                backgroundColor: '#4a148c',
                                color: '#ffffff',
                                borderRadius: '0 0 15px 15px',
                            }}
                        >
                            {following.map((followingId) => (
                                // Replace this with actual following data
                                <Link key={followingId} href={`/profile/${followingId}`}>
                                    <DialogContentText>
                                        {/* Replace this with the actual following name */}
                                        {followingId}
                                    </DialogContentText>
                                </Link>
                            ))}
                        </DialogContent>
                        <DialogActions sx={{ backgroundColor: '#4a148c', borderRadius: '0 0 15px 15px' }}>
                            <Button
                                onClick={handleFollowingClose}
                                sx={{
                                    color: '#4a148c',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '15px',
                                    border: '1px solid #ffffff',
                                }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </Dialog>


                    {!selfAccount && <Chip label={isFollowing ? 'unfollow' : 'follow'} variant="outlined" sx={{ backgroundColor: 'common.blueScheme.background', color: 'common.blueScheme.notWhite', border: '1px solid #222' }} onClick={() => {
                        if (!isFollowing)
                            followUser()
                        else
                            unfollowUser()

                        // TODO - Remove as following

                        // .then(sGetFollowing)
                        // .then(getFollowers)
                    }} />}
                </Stack>
            </Box>
        </Box>
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