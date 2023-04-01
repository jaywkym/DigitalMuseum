import { DatabaseUser, DatabaseUsersResponse } from "@/types/FirebaseResponseTypes";
import { Autocomplete, Box, CircularProgress, Grid, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

export default function ExploreSearch({users}) {

    const [open, setOpen] = useState(false);

    const { push } = useRouter();

    const loading: boolean   = open && users.length === 0;

    return (
        <Autocomplete
            id="user-lookup"
            sx={{
                width: '98%', 
                // boxShadow: '1px 1px 3px 3px',
                // backgroundColor: 'common.blueScheme.foreground'
            }}
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
                
                return (
                    <>
                        <li {...props}>
                            <Grid container alignItems="center">
                            <Grid item sx={{ display: 'flex', width: 44}}>
                                <img src={option.image} width={'50%'}/>
                            </Grid>
                            <Grid item sx={{ width: 'calc(100% - 44px)'}}>
                                <Box
                                    key={option.id}
                                    component="span"
                                    sx={{ fontWeight: 'bold', color: 'black'}}
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
                    p: 3
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
    )
}