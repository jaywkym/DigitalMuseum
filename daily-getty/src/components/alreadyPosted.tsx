import * as React from 'react';
import '@/styles/globals.css';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import ExploreIcon from '@mui/icons-material/Explore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Paper from '@mui/material/Paper';
import Link from 'next/link';
import { Typography } from '@mui/material';

const message = 'Hey! Seems like you already poisted! Come back tomorrow!';


const ComeBackLater = () => {

    return (
            <Typography variant='navButtonText' fontWeight={'200000'} fontSize={18} textAlign={'center'}>
                {message}
            </Typography>
    );
};

export default ComeBackLater;
