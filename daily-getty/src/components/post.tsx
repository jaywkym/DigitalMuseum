import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import IosShareIcon from '@mui/icons-material/IosShare';

interface PostProps {
    user: string;
    media: string;
    likes: string;
}

const handleLike = () => { } //Handle Adding Like to DataBase
const handleShare = () => { } //Overlay Share Window

const Post = () => {
    return (
        <Card>
            <Typography gutterBottom variant="h5" component="div" >
                User Post Recent
            </Typography>
            < CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image="/static/images/cards/contemplative-reptile.jpg"
            />
            <CardActions>{/*Like Button*/}
                < Button startIcon={< ThumbUpOffAltIcon />} onClick={handleLike} />
                <Button endIcon={
                    <IosShareIcon onClick={handleShare} />} />
            </CardActions>
        </Card>
    );
};

export default Post;
