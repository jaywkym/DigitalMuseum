import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Fragment, useEffect, useState } from 'react';
import { DatabasePost, DatabaseUser, DatabaseUsersResponse } from '@/types/FirebaseResponseTypes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Grid, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import HomeSearch from '@/src/components/homesearch';
import NavBar from '@/src/components/bottomnav';
import Post from '@/src/components/post';
import { requestPostFromUserById } from './database/posts';
import { PostAddSharp } from '@mui/icons-material';

export default function Asynchronous() {

    const { data: session, status } = useSession();

    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;
    const [users, setUsers] = useState([]);

    const [open, setOpen] = useState(false);
    const loading = open && users.length === 0;

    const [explorefeed, setExplorefeed] = useState([] as DatabasePost[]);

    const { push } = useRouter();

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

            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();

            const post_id = year + "_" + month + "_" + day;

            const promises = user_ids.map(async function (user) {

                let post = await requestPostFromUserById(user.id, post_id);

                return post.post

            });

            const returned_promises = await Promise.all(promises);

            return returned_promises.filter(post => {
                return post.id
            });


        }

        loadUserPosts()
            .then(setExplorefeed)
            .catch(console.error);

    }, [loading])

    useEffect(() => {
        if (!open) setUsers([]);
    }, [open]);

    return (
        <>
            <HomeSearch />
            <Autocomplete
                id="user-lookup"
                sx={{ width: 300 }}
                open={open}
                onOpen={() => {
                    setOpen(true);
                }}
                onClose={() => {
                    setOpen(false);
                }}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                options={users}
                loading={loading}
                onChange={(event: any, newValue: DatabaseUser | null) => {
                    push(`/${newValue.id}`)
                }}
                renderOption={(props, option) => {

                    console.log(option)

                    return (
                        <>
                            <li {...props}>
                                <Grid container alignItems="center">
                                    <Grid item sx={{ display: 'flex', width: 44 }}>
                                        <img src={option.image} width={'50%'} />
                                    </Grid>
                                    <Grid item sx={{ width: 'calc(100% - 44px)' }}>
                                        <Box
                                            key={option.id}
                                            component="span"
                                            sx={{ fontWeight: 'bold', color: 'black' }}
                                        >
                                            <p>{option.name}</p>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </li>
                        </>
                    )
                }}
                renderInput={(params) => (
                    <>
                        <TextField
                            {...params}
                            sx={{
                                p: 3,
                            }}
                            label="Explore Users"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </Fragment>
                                ),
                            }}
                        />
                    </>
                )}
            />

            <Stack spacing={5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <ImageList cols={1} rowHeight={600}>
                    {
                        explorefeed.map((post, i) => (
                            <ImageListItem key={i} >
                                <Post _userObj={user} _post={post} key={post.user_id + "-" + post.id} />
                            </ImageListItem>
                        ))
                    }

                </ImageList>
            </Stack>

            <NavBar />

        </>

    );
}