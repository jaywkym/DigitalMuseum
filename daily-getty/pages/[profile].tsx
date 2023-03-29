import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'
import Head from 'next/head';
import React, {useEffect, useMemo, useState} from 'react';
import { DatabasePost, DatabaseUser, DatabaseUserPostsResponse } from '@/types/FirebaseResponseTypes';
import { pull_user } from './database/profile';
import { profile } from 'console';
import { requestPostFromUserById } from './database/posts';
import { Box, Button, CircularProgress, CssBaseline, List } from '@mui/material';
import ProfileHeader from '@/src/components/profileheader';
import { green } from '@mui/material/colors';
import Post from '@/src/components/post';
import HomeSearch from '@/src/components/homesearch';
import NavBar from '@/src/components/bottomnav';

export default function Profile() {

    const {data: session, status} = useSession();

    const user: DatabaseUser = session? session.user as DatabaseUser : {} as DatabaseUser;

    const [pageProfile, setPageProfile] = useState({} as DatabaseUser)
    const [posts, setPosts] = useState([] as DatabasePost[]);
    const [postsLoading, setLoading] = useState(false);

    const router = useRouter();

    const loadProfile = router.query.profile === undefined;

    console.log(pageProfile)


    let posts_map = posts? posts : {}

    useEffect(() => {

        async function pullProfile() {
            const profile_id = router.query.profile as string;

            if(profile_id === undefined)
                return;

            const profile = await pull_user({
                id: profile_id,
                name: '',
                email: '',
                image: '',
                googleId: ''
            })


            if(profile.id) 
                setPageProfile(profile)
                    
                return profile;
            }


            
        pullProfile()
        .then(loadBlankPosts)
        .then(loadImages)
        .catch(console.error)

    }, [loadProfile])


    async function loadImages(blankPosts) {

        console.log(blankPosts)

        blankPosts.forEach(async (post) => {

            const postRequest = await requestPostFromUserById(post.user_id, post.id)
            const rPost = postRequest.post;

            if(!postRequest.success) {
                console.error("ERROR: Could not fetch post")
                console.error(postRequest);
                return;
            }
            
            const newPosts = blankPosts.map((newPost) => {
                if(newPost.id === rPost.id)
                    newPost.image.url = rPost.image.url

                return newPost;
            })

            setPosts(newPosts)
        
        })

        setLoading(false);

    }

    async function loadBlankPosts(profile: DatabaseUser) {

        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: profile.id,
            })
        }
    
        const resp = await fetch(`/api/database/posts/getAllPostsFromUser`, request)
        const dbResponse = await resp.json() as DatabaseUserPostsResponse;
        const dbPosts = dbResponse.posts;

        const blankPosts = Object.keys(dbPosts).map((id) => {
            return dbPosts[id];
        })

        blankPosts.sort().reverse()

        setPosts(blankPosts)

        return blankPosts;

    }

    if(pageProfile === undefined)
        return <p>Waiting</p>

    return (
        <>
            <Head>
                <title>Profile Page</title>
            </Head>
            <main>
                <HomeSearch />
                <Box sx={{ flexGrow: 1, m: 10 }}>
                    <CssBaseline />
                    <ProfileHeader user={pageProfile} session={session}/>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                    {postsLoading && (
                        <CircularProgress
                            size={68}
                            sx={{
                                color: green[500],
                            }}
                        />
                    )}
                        <List>
                            {
                                Object.keys(posts).map((post) => (
                                    <Post _userObj={pageProfile} _post={posts[post]} key={posts[post].id} session={session}/>
                                ))
                            }
                            
                        </List>
                    </Box>
                    <NavBar />
                </Box>
                <NavBar />
            </main>
        </>
    )
}
