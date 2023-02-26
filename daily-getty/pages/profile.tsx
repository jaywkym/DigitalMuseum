// import * as React from 'react';
// import Head from 'next/head'
// import { styled, alpha } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import { Avatar } from '@mui/material';
// import CssBaseline from '@mui/material/CssBaseline';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Button from '@mui/material/Button';
// import Typography from '@mui/material/Typography';
// import BottomNavigation from '@mui/material/BottomNavigation';
// import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import HomeIcon from '@mui/icons-material/Home';
// import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
// import IosShareIcon from '@mui/icons-material/IosShare';
// import Paper from '@mui/material/Paper';
// import List from '@mui/material/List';
// import Link from 'next/link';
// import { Container } from '@mui/system';

// const handleLike = () => { } //Handle Adding Like to DataBase

// const handleShare = () => { } //Overlay Share Window

// export default function Profile() {

//     const [value, setValue] = React.useState(0);

//     return (
//         <>
//             <Head>
//                 <title>Profile Page</title>
//             </Head>
//             <main>
//                 <Box sx={{ flexGrow: 1, bgcolor: '#262626' }}>
//                     <Container fixed>
//                         <div>
//                             <h1>
//                                 Hey, @USERNAME!
//                             </h1>
//                         </div>
//                         <div>
//                             <Avatar
//                                 alt="Remy Sharp"
//                                 src="/public/vercel.svg"
//                                 sx={{ width: 56, height: 56 }}
//                             />
//                         </div>
//                         <CssBaseline />
//                         <List>
//                             <Card sx={{ maxWidth: 345 }}>
//                                 <Typography gutterBottom variant="h5" component="div">
//                                     User Post Recent
//                                 </Typography>
//                                 <CardMedia
//                                     component="img"
//                                     alt="green iguana"
//                                     height="140"
//                                     image="/static/images/cards/contemplative-reptile.jpg"
//                                 />
//                                 <CardActions> {/*Like Button*/}
//                                     <Button startIcon={< ThumbUpOffAltIcon />} onClick={handleLike} />
//                                     <Button endIcon={< IosShareIcon onClick={handleShare} />} />
//                                 </CardActions>
//                             </Card>
//                             <Card sx={{ maxWidth: 345 }}>
//                                 <Typography gutterBottom variant="h5" component="div">
//                                     User Post Continued
//                                 </Typography>
//                                 <CardMedia
//                                     component="img"
//                                     alt="green iguana"
//                                     height="140"
//                                     image="/static/images/cards/contemplative-reptile.jpg"
//                                 />
//                                 <CardActions> {/*Like Button*/}
//                                     <Button startIcon={< ThumbUpOffAltIcon />} onClick={handleLike} />
//                                     <Button endIcon={< IosShareIcon onClick={handleShare} />} />
//                                 </CardActions>
//                             </Card>
//                         </List>
//                     </Container>
//                     <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
//                         <BottomNavigation
//                             //showLabels
//                             value={value}
//                             onChange={(event, newValue) => {
//                                 setValue(newValue);
//                             }}
//                         >
//                             <Link href="/homefeed" >
//                                 <BottomNavigationAction label="Feed" icon={<HomeIcon />} />
//                             </Link>
//                             <Link href="/newmuse">
//                                 <BottomNavigationAction label="Make a Muse" icon={<AddAPhotoIcon />} />
//                             </Link>
//                             <Link href="/profile">
//                                 <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
//                             </Link>
//                         </BottomNavigation>
//                     </Paper>
//                 </Box>
//             </main>
//         </>
//     )
// }

import * as React from 'react';
import Head from 'next/head'
import Box from '@mui/material/Box';
import { Avatar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import List from '@mui/material/List';
import { Container } from '@mui/system';
import Post from '@/src/components/post';
import NavBar from '@/src/components/bottomnav';
import ProfileHeader from '@/src/components/profileheader';

export default function Profile() {

    return (
        <>
            <Head>
                <title>Profile Page</title>
            </Head>
            <main>
                <Box sx={{ flexGrow: 1 }}>
                    <ProfileHeader />
                    <List>
                        <Post />
                    </List>
                    <Box sx={{ m: 15 }}></Box>
                    <NavBar />
                </Box>
            </main>
        </>
    )
}