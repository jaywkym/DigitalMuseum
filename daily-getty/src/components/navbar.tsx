import { BottomNavigation, Box, Button, Link, Paper } from '@mui/material';
import { Stack } from '@mui/system';
import * as React from 'react';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { useEffect, useRef, useState } from 'react';

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

const NavBar = ({isMobile}) => {

    function mobile(): JSX.Element{
        return(
            <Paper 
                sx={{ 
                    position: 'fixed', 
                    bottom: 0, 
                    left: 0, 
                    right: 0,
                    backgroundColor: 'common.blueScheme.foreground', 
                }} 
                
                elevation={3}
            >
               <BottomNavigation

                    sx={{backgroundColor: 'common.blueScheme.foreground'}}
                >

                {
                    navButtons.map(({name, icon, url}) => {
                        return (
                            <Link href={url} >
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
                top: 0
            }}>
                <Box sx={{width: '100%', maxWidth: 120}}>
                    <img src='../static/logo.png' width='100%'></img>
                </Box>
                <Stack spacing={2} >
                    {
                        navButtons.map(({name, icon, url}) => {
                            return (
                                <>
                                    <Box sx={{
                                        width:'100%', 
                                        display: {xs: 'none', md: 'flex'},
                                    }}>
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
                                                {name}
                                            </Link>

                                        </Button>
                                    </Box>
                                    <Box sx={{width:'100%', display: {xs: 'flex', md: 'none'},}}>
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
                                            <Link href={url}></Link>
                                        </Button>
                                    </Box>
                                </>
                            )
                        })
                    }
                    
                </Stack>
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