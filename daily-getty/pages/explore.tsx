import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useMemo, useState } from 'react';
import { DatabasePost, DatabaseUser, DatabaseUsersResponse } from '@/types/FirebaseResponseTypes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box,ImageList, ImageListItem,Typography } from '@mui/material';
import NavBar from '@/src/components/navbar';
import Post from '@/src/components/post';
import { constructCurrentDateId, requestPostFromUserById } from './database/posts';
import ExploreSearch from '@/src/components/ExploreSearch';
import useScreenSize from './database/pages';
import { green } from '@mui/material/colors';

export default function Asynchronous() {

    const { data: session, status } = useSession();

    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [explorefeed, setExplorefeed] = useState([] as DatabasePost[]);
    const [checkedForPosts, setCheckedForPosts] = useState(false)
    const [isXS, isSM, isMD, isLG, isXL] = useScreenSize();

    const postsLoading = explorefeed.length === 0 && !checkedForPosts
    const noPosts = explorefeed.length === 0 && checkedForPosts

    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;

    useEffect(() => {

        async function loadUserPosts() {

            const posts = [];
            const resp = await fetch(`/api/database/profile/getAllUsers`, { method: 'POST' })
            const json = await resp.json() as DatabaseUsersResponse;

            if (!json.success)
                return;

            const dbUsers = json.users;

            const user_ids: DatabaseUser[] = [];

            Object.keys(dbUsers).map((user_id) => user_ids.push(dbUsers[user_id]))

            setUsers(user_ids);

            const post_id = constructCurrentDateId();

            const promises = user_ids.map(async function (user) {

                let post = await requestPostFromUserById(user.id, post_id);

                return post.post

            });

            const returned_promises = await Promise.all(promises);

            setCheckedForPosts(true)

            return returned_promises.filter(post => {
                return post.id
            });


        }

        loadUserPosts()
            .then(setExplorefeed)
            .catch(console.error);

    }, [])

    useEffect(() => {
        if (!open) setUsers([]);
    }, [open]);

    return (
        <>
            <Box
                position={'fixed'}
                width={'100vw'}
                height={'100vh'}
                sx={{ backgroundColor: 'common.blueScheme.background' }}
                zIndex={-10}
            >

            </Box>
            <NavBar isMobile={isXS} session={session} />

            <Box display={'flex'} justifyContent={'end'} flexDirection={'column'} alignItems={'end'}>
                <Box
                    sx={{
                        width: { xs: '100%', sm: '90%', md: '80%' },
                    }}

                    display={'flex'}
                    justifyContent={'center'}
                >

                    <ExploreSearch users={users} />
                    
                </Box>
                <Box
                    sx={{
                        width: {
                            xs: '100%',
                            sm: '90%',
                            md: '80%'
                        },
                    }}

                    display={'block'}
                    padding={4}
                >

                    {noPosts &&

                        <Typography variant={'h4'} color={'common.blueScheme.notWhite'} textAlign={'center'}>
                            No Posts Today... Dang...
                        </Typography>

                    }


                    {postsLoading && (
                        <Box width={'100%'} display={'flex'} justifyContent={'center'}>

                            <CircularProgress
                                size={68}
                                sx={{
                                    color: green[500],
                                }}
                            />

                        </Box>
                    )}

                    <ImageList cols={isXS ? 1 : isSM ? 3 : 2} gap={20} sx={{ overflow: 'hidden' }}>

                        {

                            explorefeed.map((post, i) => (
                                <ImageListItem key={i} >
                                    <Post _userObj={user} _post={post} key={post.user_id + "-" + post.id} session={session} />
                                </ImageListItem>
                            ))
                        }

                    </ImageList>

                </Box>

            </Box>

        </>

    );
}