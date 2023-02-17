import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Paper from '@mui/material/Paper';
import Link from 'next/link';

const NavBar = () => {

    const [value, setValue] = React.useState(0);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >
                <Link href="/homefeed">
                    <BottomNavigationAction label="Feed" icon={<HomeIcon />} />
                </Link>
                <Link href="/newmuse">
                    <BottomNavigationAction label="Make a Muse" icon={<AddAPhotoIcon />} />
                </Link>
                <Link href="/profile">
                    <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
                </Link>
            </BottomNavigation>
        </Paper>
    );
};

export default NavBar;
