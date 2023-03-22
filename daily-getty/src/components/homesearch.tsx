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

const HomeSearch = () => {

    return (
        <AppBar position="static" style={{ background: '#000000' }}>
            <Toolbar>
                <Button style={{
                    borderRadius: 28,
                    backgroundColor: "#FFFFFF",
                    padding: "14px 28px",
                    fontSize: "14px",
                    textDecorationColor: "black"
                }} onClick={() => { signOut(); }}>
                    <Typography color={'#000000'}>Logout</Typography>
                </Button>
                <Typography
                    variant="h3"
                    noWrap
                    component="div"
                    align="center"
                    sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, textAlignContent: 'center' }}
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
