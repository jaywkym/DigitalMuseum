import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { Fragment, useEffect, useState } from 'react';
import { DatabaseUser, DatabaseUsersResponse } from '@/types/FirebaseResponseTypes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Grid, Typography } from '@mui/material';

export default function Asynchronous() {

    const {data: session, status} = useSession();

    const user: DatabaseUser = session? session.user as DatabaseUser : {} as DatabaseUser;
    const [users, setUsers] = useState([]);

    const [open, setOpen] = useState(false);
    const loading = open && users.length === 0;

    const { push } = useRouter();

    useEffect(() => {

        async function loadUsers() {
    
            const resp = await fetch(`/api/database/profile/getAllUsers`, {method: 'POST'})
            const json = await resp.json() as DatabaseUsersResponse;

            if(!json.success)
                return;

            const dbUsers = json.users;

            const new_users: DatabaseUser[] = [];

            Object.keys(dbUsers).map((user_id) => new_users.push(dbUsers[user_id]))

            setUsers(new_users);
        }

        loadUsers()
        .catch(console.error);

    }, [loading])

    useEffect(() => {
        if (!open) setUsers([]);
    }, [open]);

    return (
        <Autocomplete
        id="user-lookup"
        sx={{ width: 300 }}
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

            console.log(option)
            
            return (
                <>
                    <li {...props}>
                        <Grid container alignItems="center">
                        <Grid item sx={{ display: 'flex', width: 44 }}>
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
    );
}