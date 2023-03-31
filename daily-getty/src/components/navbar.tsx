import { Box, Button } from '@mui/material';
import { Stack } from '@mui/system';
import * as React from 'react';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

const navButtons: navButton[] = [{name: 'Explore', icon: <ExploreIcon />}, {name: 'Homefeed', icon: <HomeIcon />}, {name: 'NewMuse', icon: <AddCircleIcon />}, {name: 'Profile', icon: <AccountBoxIcon />}, ];

type navButton = {
    name: string,
    icon: JSX.Element
}

const NavBar = () => {

    const isMobile = false;

    function mobile(): JSX.Element{
        return(
            <Box sx={{width: {xs: '0%', sm: '10%', md: '20%'}, backgroundColor: 'red', height: '100vh'}}>
                

            </Box>
        )
    }

    navButtons.map((button) => {
      console.log(button)
    })

    function desktop(): JSX.Element{
        return(
            <Box sx={{width: {xs: '0%', sm: '10%', md: '20%'}, backgroundColor: 'common.blueScheme.darkestBlue', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Box sx={{width: '100%'}}>
                    <img src='../static/logo.png' width='100%'></img>
                </Box>
                <Stack spacing={2} sx={{width:'100%'}}>
                    {
                        navButtons.map(({name, icon}) => {
                            return (
                                <Box sx={{width:'100%'}}>
                                    <Button 
                                        sx={{color:'white', textAlign:'left', width:'100%', display: 'flex', alignItems: 'left', justifyContent: 'left'}}
                                        size='large'
                                        variant='text'
                                        startIcon={icon}
                                    >
                                    {name}
                                    </Button>
                                </Box>
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