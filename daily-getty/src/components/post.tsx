import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import useState from 'react';
import Imagelist from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import IosShareIcon from '@mui/icons-material/IosShare';
<<<<<<< Updated upstream
import { Container } from '@mui/system';
=======
import { Container, style } from '@mui/system';
import { DatabasePost, DatabaseUser } from '@/types/FirebaseResponseTypes';
>>>>>>> Stashed changes


interface PostProps {
    user: string;
    media: string;
    likes: string;
}

const handleLike = () => { } //Handle Adding Like to DataBase
const handleShare = () => { } //Overlay Share Window
const visitProfile = () => { } //Visit Profile

<<<<<<< Updated upstream
const Post = () => {
    return (
        <Box sx={{ m: 3 }}>
            <Card raised>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center', m: 1 }}>
                    <Button onClick={visitProfile}>
                        <Avatar alt="Jay Kim" src="/static/avatar.png" />
                        <div></div>
                        <Typography gutterBottom variant="body1" component="div" >
                            @jaywkym
                        </Typography>
                    </Button>
                </Box>
                < CardMedia
                    component="img"
                    alt="post"
                    height="280"
                    image="/static/sunflower_example.png"
                />
                <CardActions>{/*Like Button*/}
                    < Button startIcon={< ThumbUpOffAltIcon />} onClick={handleLike} />
                    <Button endIcon={
                        <IosShareIcon onClick={handleShare} />} />
                </CardActions>
            </Card>
=======
const Post = ({userObj, post}) => {

    const alt = post.image? post.image.userPrompt : "";
    const src = post.image? `data:image/png;base64, ${post.image.b64}` : ``
    const [count, setCount] = useState(0);

    async function imageClick(src){
        console.log("in image click");
        document.getElementById(src).style.opacity = '0';
    }
    
    async function imageHover(){
        console.log("in image hover");
    }

    return (
        <Box sx={{ m: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', alignContent: 'center' }}>
            
            <div>
                <Card sx={{ width: '360px' }}>


                    
                </Card>

                <img src={src} id={src} width="360px" height="360px" 
                    onMouseEnter = {imageHover}
                    onClick = {() => imageClick(src)}
                    style={{
                        opacity:'1.0'
                    }}
                >
                
                
                </img>

            </div>

>>>>>>> Stashed changes
        </Box>
    );
};

export default Post;
