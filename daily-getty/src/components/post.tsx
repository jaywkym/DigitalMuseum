import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Container } from '@mui/system';
import { DatabasePost, DatabaseUser } from '@/types/FirebaseResponseTypes';


interface PostProps {
    user: string;
    media: string;
    likes: string;
}

const handleLike = () => { } //Handle Adding Like to DataBase
const handleShare = () => { } //Overlay Share Window
const visitProfile = () => { } //Visit Profile

const Post = ({userObj, post}) => {

    const alt = post.image? post.image.userPrompt : "";
    const src = post.image? `data:image/png;base64, ${post.image.b64}` : `data:image/png;base64`
    return (
        <Box sx={{ m: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center' }}>
            <Card raised sx={{ width: '356px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center', m: 1 }}>
                    {/*<Button onClick={visitProfile}>*/}
                    <Avatar alt={userObj.name} src={userObj.image} />
                    <div></div>
                    <Typography gutterBottom variant="body1" component="div" >
                        @{userObj.name}
                    </Typography>
                    {/* </Button>*/}
                </Box>
                < CardMedia
                    component="img"
                    alt={alt}
                    height="280"
                    image={src}
                />
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
