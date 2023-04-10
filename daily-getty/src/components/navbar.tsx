import { Avatar, BottomNavigation, Box, Button, Chip, Link, Paper, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import * as React from 'react';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useEffect, useRef, useState } from 'react';
import { DatabaseUser } from '@/types/FirebaseResponseTypes';
import { requestFriendsForUser } from '@/pages/database/profile';
import { signOut } from 'next-auth/react';

const navButtons: navButton[] = [
    {name: 'Homefeed', icon: <HomeIcon sx={{transform: 'scale(1.5)'}} />, url: '/homefeed'}, 
    {name: 'Explore', icon: <ExploreIcon sx={{transform: 'scale(1.5)'}}/>,url: '/explore'}, 
    {name: 'NewMuse', icon: <AddCircleIcon  sx={{transform: 'scale(1.5)'}} />, url: '/newmuse'}, 
    {name: 'Profile', icon: <AccountBoxIcon  sx={{transform: 'scale(1.5)'}} />, url: '/profile'}, 
];

type navButton = {
    name: string,
    icon: JSX.Element,
    url: string
}

const NavBar = ({isMobile, session, isUpdated}) => {

    let user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;
    const userNeedsUpdate = user.id === undefined;

    const [followers, setFollowers] = useState([] as string[]);
    const [following, setFollowing] = useState([] as string[]);
    const [loadingFriends, setLoadingFriends] = useState(true);

    const [hover, setHover] = useState(false);

    useEffect(() => {

        if(userNeedsUpdate)
            return;

        async function pullFriends() {

            setLoadingFriends(true);

            console.log("start got here")
            const dbFriends = await requestFriendsForUser(user.id)
            
            console.log("got here?")
            console.log(dbFriends)
            if(!dbFriends.success)
                return;

            setFollowers(dbFriends.friends.followers);
            setFollowing(dbFriends.friends.following)
            setLoadingFriends(false)

        }

        pullFriends()
        .catch(console.error)

    }, [userNeedsUpdate])

    useEffect(() => {

        if(isUpdated == false){
            return;
        }

        async function pullFriends() {

            setLoadingFriends(true);

            console.log("start got here")
            const dbFriends = await requestFriendsForUser(user.id)
            
            console.log("got here?")
            console.log(dbFriends)
            if(!dbFriends.success)
                return;

            setFollowers(dbFriends.friends.followers);
            setFollowing(dbFriends.friends.following)
            setLoadingFriends(false)

        }

        pullFriends()
        .catch(console.error)

    }, [isUpdated])

    function mobile(): JSX.Element{
        return(
            <Paper 
                sx={{ 
                    position: 'fixed', 
                    bottom: 0, 
                    left: 0, 
                    right: 0,
                    backgroundColor: 'common.blueScheme.foreground', 
                    zIndex: '10'
                }} 
                
                elevation={3}
            >
               <BottomNavigation

                    sx={{backgroundColor: 'common.blueScheme.foreground'}}
                >

                {
                    navButtons.map(({name, icon, url}) => {
                        return (
                            <Link href={url} key={name} >
                                <BottomNavigationAction 
                                    label={name} 
                                    icon={icon}
                                    sx={{color: 'white'}} 
                                />
                            </Link>
                        )

                    })
                }

                </BottomNavigation>
                    

            </Paper>
        )
    }

    function desktop(): JSX.Element{
        return(
            <Box sx={{
                width: {xs: '0%', sm: '10%', md: '20%'}, 
                backgroundColor: 'common.blueScheme.foreground', 
                height: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                zIndex: 1,
                position: 'fixed',
                boxShadow: '1px 1px 7px 7px'
            }}>
                <Box sx={{width: '100%', maxWidth: 120}}>
                    <Link href='/homefeed'><img src='../static/logo.png' width='100%'></img></Link>
                </Box>
                <Stack spacing={2} >
                    {
                        navButtons.map(({name, icon, url}) => {
                            return (
                                <>
                                    <Box 
                                    
                                    sx={{
                                        width:'100%', 
                                        display: {xs: 'none', md: 'flex'},
                                    }}
                                    
                                    key={"nav-button" + name}
                                    >
                                        <Button 
                                            sx={{
                                                color:'white', 
                                                textAlign:'left', 

                                            }}
                                            size='large'
                                            variant='text'
                                            startIcon={icon}
                                        >
                                            <Link
                                             href={url}
                                             underline={'none'}
                                             color={'white'}>
                                                <Typography variant='navButtonText'>
                                                    {name}
                                                </Typography>
                                            </Link>

                                        </Button>
                                    </Box>
                                    <Box sx={{width:'100%', display: {xs: 'flex', md: 'none'},}}>
                                        <Link href={url}>
                                            <Button 
                                                sx={{
                                                    color:'white', 
                                                    paddingRight: 0,
                                                    display: {xs: 'none', sm: 'inherit'}
                                                }}
                                                size='large'
                                                variant='text'
                                                startIcon={icon}
                                            >
                                           
                                            </Button>
                                        </Link>
                                    </Box>
                                </>
                            )
                        })
                    }
                    
                </Stack>
                <Box 
                    height={'100%'} 
                    display={'flex'} 
                    justifyContent={'end'} 
                    flexDirection={'column'}
                    alignItems={'center'}
                >
                    <Link href={'/profile'}>
                        <Avatar
                            alt="placeholder"
                            src={user.image}
                            sx={{ 
                                width: {
                                    sm: 45, 
                                    md: 70
                                }, 
                                height: {
                                    sm: 45, 
                                    md: 70
                                }, 
                                marginBottom: '10px'
                            }}
                        />
                    </Link>

                    <Typography 
                        variant='navButtonText' 
                        color={'common.blueScheme.notWhite'}
                        sx={{display: {xs: 'none', md: 'flex'}}}
                    >
                        @{user.name}
                    </Typography>
                    <LogoutIcon 
                        sx={{
                            display: {xs: 'flex', md: 'none'},
                            marginBottom: '10px',
                            color: 'common.blueScheme.notWhite',
                            ":hover": {
                                cursor: 'pointer'
                            }
                        }}
                        

                        onClick={() => signOut()}
                    />
                
                        <Box sx={{display: {xs: 'none', md: 'flex', flexDirection: 'row', justifyItems: 'space-between'}}}>

                        </Box>
                        <Box sx={{display: {xs: 'none', md: 'block'}}}>
                            <Button 
                                style={{
                                    borderRadius: 5,
                                   
                                    margin: "14px 28px",
                                    padding: "14px 28px",
                                    fontSize: "14px",
                                    textDecorationColor: "common.blueScheme.notWhite",
                                }} 
                                
                                onClick={() => signOut()}
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                            >
                                <Typography color={'common.blueScheme.notWhite'}>Logout</Typography>
                            </Button>
                        </Box>
                    
                </Box>
            </Box>
        )
    }

    if(isMobile){
        return mobile();
    }
    else{
        return desktop();
    }

};

export default NavBar;