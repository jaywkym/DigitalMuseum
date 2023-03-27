import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Imagelist from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Skeleton, ToggleButton } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import IosShareIcon from '@mui/icons-material/IosShare';
import { DatabasePost, DatabaseUser } from '@/types/FirebaseResponseTypes';
import { useEffect, useState } from 'react';
import { pull_user } from '@/pages/database/profile';
import Link from 'next/link';
import { requestIfUserLikesPost, useLikeImage, useUnlikeImage, useUserLikesImage } from '@/pages/database/posts';
import { useSession } from 'next-auth/react';
import { request } from 'http';
import { ToggleOnRounded } from '@mui/icons-material';

interface PostProps {
    user: string;
    media: string;
    likes: string;
}


const visitProfile = () => { } //Visit Profile

const Post = ({ userObj, post }) => {

    const { data: session, status } = useSession();

    const user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;

    const [isHovering, setIsHovered] = useState(false);

    const [postProfile, setPostProfile] = useState({} as DatabaseUser)

    const alt = post.image ? post.userPrompt : "";
    const postQuestion = post.givenPrompt ? post.givenPrompt : "";
    const date = post.id ? post.id : "";
    const src = post.image ? `data:image/png;base64, ${post.image.b64}` : ``
    const profileName = postProfile ? postProfile.name : ''
    const profileImage = postProfile ? postProfile.image : ''
    const profileLink = postProfile ? postProfile.id : ''




    const [clicked, setClicked] = useState(false);

    const [likeSuccess, likeLoading, likePost] = useLikeImage(user.id, post.id, post.user_id)
    const [unlikeSuccess, unlikeLoading, unlikePost] = useUnlikeImage(user.id, post.id, post.user_id)

    const [userLikesPost, setUserLikesPost] = useState(false)

    async function getUserLikesPost() {
        const resp = await requestIfUserLikesPost(user.id, post.id, post.user_id);
        setUserLikesPost(resp)
        setClicked(resp)
    }
    
    async function getUserInfo() {
        const resp_profile = await pull_user({ id: post.user_id } as DatabaseUser);
        if (resp_profile.id)
            setPostProfile(resp_profile)
    }

    const contentType = "image/png"

    const handleShare = (event) => { 

        console.log(event.target)
        console.log(post.image)
        const base64Data = post.image.b64;
    
        const linkSource = `data:${contentType};base64,${base64Data}`;
        const downloadLink = document.createElement("a");
        downloadLink.href = linkSource;
        downloadLink.download = post.userPrompt;
        downloadLink.click();
    
    } //Overlay Share Window

    useEffect(() => {

        getUserInfo()
            .catch(console.error)

        getUserLikesPost()
            .catch(console.error)

    }, [post])

    async function handleLike() {
        console.log({userLikesPost: userLikesPost})
        if (userLikesPost)
            await unlikePost()
        else
            await likePost()

        await getUserLikesPost()
        console.log({userLikesPost: userLikesPost})

    }

    return (
        <Card raised sx={{ display: 'flex', width: '800px', mt: 5, boxShadow: 4 }}>
            {src === `data:image/png;base64, ` && <Skeleton variant="rectangular" animation="pulse" height={280} /> /*src !== `data:image/png;base64, ` && */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                {/* {isHovering ? (
                    <div style={{ height: 500, width: 450 }}>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                            <Typography>
                                    Question: {postQuestion}
                                    <br></br>
                                    User Response: {alt}
                                    <br></br>
                                    Date: {date}:
                            </Typography>
                        </Box>
                    </div>
                ) : ( */}
                < CardMedia
                    component="img"
                    alt={alt}
                    height={500}
                    width={500}
                    image={src}
                />
                {/* )} */}
            </div>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>

                <Link href={`/${profileLink}`}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', m: 2 }}>
                        {/*<Button onClick={visitProfile}>*/}
                        <Avatar alt={userObj.name} src={profileImage} sx={{ mr: 2 }} />
                        <Typography variant="body1" component="h1">
                            <b>@{profileName}</b>
                        </Typography>
                    </Box>
                </Link>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', p: 3 }}>
                    <Typography><b>Question:</b> {postQuestion}</Typography>
                    <Typography><b>User Response:</b> {alt}</Typography>
                    <Typography><b>Date Posted:</b> {date}</Typography>
                </Box>
                <CardActions>
                    {!userLikesPost && <ToggleButton value = "check" selected={clicked} onClick= {() => {
                        handleLike();
                        setClicked(!clicked);
                    }
                        }> <ThumbUpOffAltIcon/>
                    </ToggleButton>}
                    {userLikesPost && <ToggleButton value = "check" selected={clicked} onClick= {() => {
                        handleLike();
                        setClicked(!clicked);
                    }
                        }> <ThumbUpIcon/>
                    </ToggleButton>}
                    <Button endIcon={<DownloadIcon />} onClick={handleShare} />
                </CardActions>

            </Box>
        </Card>


    );

}


export default Post;
