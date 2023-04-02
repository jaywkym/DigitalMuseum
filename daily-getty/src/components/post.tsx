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
import { Avatar, CardActionArea, Collapse, Grow, ImageListItemBar, Skeleton, ToggleButton } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import IosShareIcon from '@mui/icons-material/IosShare';
import { DatabasePost, DatabaseUser } from '@/types/FirebaseResponseTypes';
import { Fragment, useEffect, useRef, useState } from 'react';
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

    const userName = userObj? userObj.name : ''

    const [deleteButton, setDeleteButton] = useState(null);
    const [clicked, setClicked] = useState(false);
    const [likeSuccess, likeLoading, likePost] = useLikeImage(user.id, post.id, post.user_id)
    const [unlikeSuccess, unlikeLoading, unlikePost] = useUnlikeImage(user.id, post.id, post.user_id)

    const [userLikesPost, setUserLikesPost] = useState(false)

    const imageNeedsUpdate = post.id === undefined || post.user_id === undefined;

    function convertPostIdToDateObj(post_id) {
        const dates = [...post_id.matchAll(/\d+/g) as any]
        const date = new Date(dates[0], dates[1] - 1, dates[2])
        return date
    }

    function generateTimeDifferenceString(post_date) {
        const difference = Date.now() - post_date.getTime()
        const days = Math.floor(difference / 86400000) // Milliseconds to days
        const months = Math.floor(days / 31);
        
        if(days === 0) {
            return "Today";
        }

        else if(days <= 30) {
            return days + " days ago"
        }

        return months + " months ago"
    }

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

    const imageRef = useRef(null);
    const imageHeight = imageRef.current? imageRef.current.height : 0

    return (
        <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={src}
                loading='lazy'
                width={'100%'}
                ref={imageRef}
            />
            <Box
                sx={{
                    height: '100%',
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                }}
            >
                <Collapse 
                    in={isHovering} 
                    orientation='vertical' 
                    timeout={'auto'} 
                    collapsedSize={'20%'}
                >
                    <Box
                        width={'100%'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'space-between'}
                    >
                        <Box 
                            width={'100%'} 
                            sx={{
                                backgroundColor: 'rgba(0, 0, 0, .7)', 
                                height: imageHeight,
                                color: 'common.blueScheme.notWhite'
                            }}
                            display={'flex'}
                            flexDirection={'column'}
                            justifyContent={'space-between'}
                        >
                            <Box
                                width={'100%'}
                                height={'100%'}
                                display={'flex'}
                                justifyContent={'space-between'}
                            >
                                <Box 
                                    padding={1}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                    height={'20%'}
                                >

                                    <Typography>
                                        @{profileName}
                                    </Typography>
                                    <Typography>
                                        {generateTimeDifferenceString(convertPostIdToDateObj(post.id))}
                                    </Typography>
                                </Box>

                                <Box
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'center'}
                                    height={'20%'}
                                    padding={1}
                                >
                                    {
                                        !userLikesPost && 
                                        <ThumbUpOffAltIcon 
                                            sx={{
                                                color: 'common.blueScheme.notWhite', 
                                                paddingRight: .5,
                                                ":hover": {
                                                    cursor: 'pointer'
                                                }
                                            }} 
                                            
                                            
                                            onClick={handleLike}
                                        />
                                    }
                                    {
                                        userLikesPost && 
                                        <ThumbUpIcon
                                            sx={{
                                                color: 'white', 
                                                paddingRight: .5,
                                                ":hover": {
                                                    cursor: 'pointer'
                                                }
                                            }} 
                                            
                                            onClick={handleLike}
                                        />
                                    }
                                </Box>
                            </Box>
                            <Box>
                                <Typography textAlign={'center'}>
                                    {postQuestion}
                                </Typography>
                                <Typography textAlign={'center'}>
                                    {post.userPrompt}
                                </Typography>
                            </Box>
                            
                        </Box>
                    </Box>
                    
                </Collapse>
            </Box>
            
        </Box>

    );

}


export default Post;
