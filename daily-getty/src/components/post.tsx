import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Skeleton } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Container } from '@mui/system';
import { DatabasePost, DatabaseUser } from '@/types/FirebaseResponseTypes';
import { useEffect, useState } from 'react';
import { pull_user } from '@/pages/database/profile';
import Link from 'next/link';


interface PostProps {
    user: string;
    media: string;
    likes: string;
}

const handleLike = () => { } //Handle Adding Like to DataBase
const handleShare = () => { } //Overlay Share Window
const visitProfile = () => { } //Visit Profile

const Post = ({userObj, post}) => {

    const [postProfile, setPostProfile] = useState({} as DatabaseUser)

    const alt = post.image? post.image.userPrompt : "";
    const src = post.image? `data:image/png;base64, ${post.image.b64}` : ``
    const profileName = postProfile? postProfile.name : ''
    const profileImage = postProfile? postProfile.image : ''
    const profileLink = postProfile? postProfile.id : ''

    useEffect(() => {

        async function getUserInfo() {
            const resp_profile = await pull_user({id: post.user_id} as DatabaseUser);
            if(resp_profile.id)
                setPostProfile(resp_profile)
        }

        getUserInfo()
        .catch(console.error)

    }, [post])

    return (
        <Box sx={{ m: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center' }}>
            <Card raised sx={{ width: '356px' }}>
                <Link href={`/${profileLink}`}>
                    
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center', m: 1 }}>
                        {/*<Button onClick={visitProfile}>*/}
                        <Avatar alt={userObj.name} src={profileImage} />
                        <div></div>
                        <Typography gutterBottom variant="body1" component="div" >
                            @{profileName}
                        </Typography>
                        {/* </Button>*/}
                    </Box>
                </Link>
                { src === `data:image/png;base64, ` && <Skeleton variant="rectangular" animation="pulse" height={280} />}
                {src !== `data:image/png;base64, ` && < CardMedia
                    component="img"
                    alt={alt}
                    height="280"
                    image={src}
                />}
                {/*
                <CardActions>
                    < Button startIcon={< ThumbUpOffAltIcon />} onClick={handleLike} />
                    <Button endIcon={
                        <IosShareIcon onClick={handleShare} />} />
                </CardActions>
                */}
            </Card>
        </Box>
    );
};

export default Post;
