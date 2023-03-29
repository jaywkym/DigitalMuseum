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
import { requestIfUserLikesPost, useLikeImage, useUnlikeImage } from '@/pages/database/posts';
import { ToggleOnRounded } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';

const Post = ({ _userObj, _post, session }) => {


    const userObj = _userObj as DatabaseUser;
    const post = _post as DatabasePost;

    let user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;

    const [isHovering, setIsHovered] = useState(false);

    const [postProfile, setPostProfile] = useState({} as DatabaseUser)

    const alt = post.userPrompt
    const postQuestion = post.givenPrompt
    const date = post.id
    const src = post.image.url
    const userPost = post.user_id

    const profileName = postProfile.name
    const profileImage = postProfile.image
    const profileLink = postProfile.id

    const [deleteButton, setDeleteButton] = useState(null);
    const [clicked, setClicked] = useState(false);
    const [likeSuccess, likeLoading, likePost] = useLikeImage(user.id, post.id, post.user_id)
    const [unlikeSuccess, unlikeLoading, unlikePost] = useUnlikeImage(user.id, post.id, post.user_id)

    const [userLikesPost, setUserLikesPost] = useState(false)

    const imageNeedsUpdate = post.id === undefined || post.user_id === undefined;

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

    const handleShare = (event) => { 

        const url = post.image.url;

        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = post.userPrompt;
        downloadLink.click();
    
    } //Overlay Share Window

    const deletePost = async () => {

        const deleteInfo = {
            owner_id: userPost,
            post_id: date
        }

        const requesting = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deleteInfo)
        }

        try {
            const resp = await fetch('/api/database/posts/deletePost', requesting)
            if(resp.status === 200)
                window.location.reload();
        } catch (err: any) {
            console.error(err)
        }
    }

    useEffect(() => {

        if(imageNeedsUpdate)
            return;

        getUserInfo()
            .catch(console.error)

        getUserLikesPost()
            .catch(console.error)

    }, [])

    async function handleLike() {

        if (userLikesPost)
            await unlikePost()
        else
            await likePost()

        await getUserLikesPost()

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

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', width: '350px'}}>

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
                    {deleteButton}
                </CardActions>

            </Box>
        </Card>


    );

}


export default Post;
