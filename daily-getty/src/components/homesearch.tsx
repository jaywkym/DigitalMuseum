import React, { useState } from 'react';
import Head from 'next/head'
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { List } from '@mui/material';
import { signOut } from 'next-auth/react';
import { Button } from '@mui/material';

//SEARCH BAR STYLING
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '50%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

//COMPONENT
const HomeSearch = () => {
    //HANDLE ON CHANGE and REACT STATES
    const [searchFormState, setSearchFormState] = useState('');
    const onTextChange = (e: any) => setSearchFormState(e.target.value);
    const [searchResults, setSearchResults] = useState([]);

    //PERFORM SEARCH FUNCTION
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const results = performSearch(searchFormState);
        setSearchResults(results);
    };

    const performSearch = (searchTerm) => {
        // Perform the search and return an array of results
        return [
            'Result 1',
            'Result 2',
            'Result 3'
        ];
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Button  style={{
                borderRadius: 35,
                backgroundColor: "#21b6ae",
                padding: "18px 36px",
                fontSize: "18px",
                textDecorationColor: "black"
                }}  onClick={() => { signOut(); }}>Logout</Button>
                <Typography
                    variant="h3"
                    noWrap
                    component="div"
                    align="center"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block'}, textAlignContent: 'center'  }}
                >
                    DailyMuse
                </Typography>
                {/*
<Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        onChange={onTextChange}
                    />
                    {searchFormState.length > 0 && (
                        <ul>
                            {searchResults.map((result, index) => (
                                <li key={index}>{result}</li>
                            ))}
                        </ul>
                    )}
                </Search>
                 */}
            </Toolbar>
        </AppBar>
    );
};

export default HomeSearch;
