import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { DatabasePost, DatabaseUser, DatabaseUsersResponse } from '@/types/FirebaseResponseTypes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Container, Grid, ImageList, ImageListItem, Stack, Typography } from '@mui/material';
import HomeSearch from '@/src/components/homesearch';
import NavBar from '@/src/components/navbar';
import Post from '@/src/components/post';
import { constructCurrentDateId, requestPostFromUserById } from './database/posts';
import { PostAddSharp } from '@mui/icons-material';
import ExploreSearch from '@/src/components/ExploreSearch';

export default function Asynchronous() {

    const {data: session, status} = useSession();
    
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [explorefeed, setExplorefeed] = useState([] as DatabasePost[]);

    const { push } = useRouter();

    const user: DatabaseUser = session? session.user as DatabaseUser : {} as DatabaseUser;
    const loading: boolean   = open && users.length === 0;

    const [screenSize, setScreenSize] = useState(0)

    useEffect(() => {
        setScreenSize(window.innerWidth);

        window.addEventListener('resize', () => {
            setScreenSize(window.innerWidth);
        })

        return () => {
            window.removeEventListener("resize", () => {
                setScreenSize(window.innerWidth);
            })
        }
    }, []);

    const isMobile: boolean = screenSize <= 600;
    const isMD: boolean = screenSize <= 900

    useEffect(() => {

        async function loadUserPosts() {
    
            const posts = [];
            const resp = await fetch(`/api/database/profile/getAllUsers`, {method: 'POST'})
            const json = await resp.json() as DatabaseUsersResponse;

            if(!json.success)
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
                sx={{backgroundColor: 'common.blueScheme.background'}} 
                zIndex={-10}
            >

            </Box>
            <NavBar isMobile={isMobile} session={session}/>
           
            <Box display={'flex'} justifyContent={'end'} flexDirection={'column'} alignItems={'end'}>
                <Box 
                    sx={{
                        width: {xs: '100%', sm: '90%', md: '80%'}, 
                    }}

                    display={'flex'}
                    justifyContent={'center'}
                >

                    <ExploreSearch users={users}/>
                    {/* <Post _userObj={session} _post={testPost} key={1} session={session} /> */}

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
                    
                    <ImageList cols={isMobile? 1 : isMD? 2 : 3} gap={20}>

                    {
                                
                        explorefeed.map((post, i) => (
                            <ImageListItem key={i} >
                                <Post _userObj={user} _post={post} key={post.user_id + "-" + post.id} session={session}/>
                            </ImageListItem>
                        ))
                    }

                    </ImageList>

                </Box>
                
            </Box>
           
        </>
       
    );
}