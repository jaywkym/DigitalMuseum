import * as React from 'react';
import { signIn, signOut } from 'next-auth/react';
import CssBaseline from '@mui/material/CssBaseline';
import GoogleButton from 'react-google-button'
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import Image from 'next/image';
import bg from "../public/loginbg.jpg";

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
  const [loading, setLoading] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <>
      <div style={{
        zIndex: -1,
        position: "fixed",
        width: "100vw",
        height: "100vh",
      }}>
        <Image src={bg} alt="background" object-fit="cover" fill></Image>
      </div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container component="main" maxWidth="xs">
          <Box sx={{ paddingTop: 5 }}><Box
            sx={{
              paddingTop: 8,
              mb: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
              bgcolor: '#FFFFFF',
              boxShadow: 4,
            }}
          >
            <Typography component="h1" variant="h3" sx={{ paddingTop: 3, mb: 3, justifyContent: 'center' }}>
              Welcome to your DailyMuse!
            </Typography>
            <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
              Login/Signup Using Google
            </Typography>
            <Box sx={{
              m: 2,
              bgcolor: '#FFFFFF',
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <GoogleButton
                onClick={() => { signIn('google', { callbackUrl: '/homefeed', redirect: false }) }}
              />
            </Box>
          </Box>
          </Box>
        </Container>
        {/* REGULAR LOGIN FORM (LIKELY NOT USING)
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              required
              fullWidth
              label="Email"
              margin="normal"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <TextField
              required
              fullWidth
              label="Password"
              margin="normal"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
              onClick={async (event) => {

                console.log({
                  email: email,
                  password: password
                })

                await signIn('credentials', {
                  email: email,
                  password: password,
                  callbackUrl: '/homefeed',
                  redirect: false
                })

              }}

            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Log In'
              )}
            </Button>
            <Link href="#" variant="body2">
          Forgot password?
        </Link>
              */}
      </ThemeProvider >
    </>
  );
}