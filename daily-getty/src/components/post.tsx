import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Imagelist from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, CardActionArea, Collapse, Grow, ImageListItemBar, Skeleton, ToggleButton, TextField, ListItem, ListItemText, ListItemButton, List } from '@mui/material';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { CommentsResponse, DatabaseComment, DatabasePost, DatabaseUser } from '@/types/FirebaseResponseTypes';
import { Fragment, useEffect, useRef, useState } from 'react';
import { pull_user } from '@/pages/database/profile';
import Link from 'next/link';
import { requestIfUserLikesPost, useLikeImage, useUnlikeImage } from '@/pages/database/posts';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { FixedSizeList, ListChildComponentProps} from 'react-window';
import {
    RedditShareButton,
    RedditIcon,
} from 'next-share'

const Post = ({ _userObj, _post, session }) => {


    console.log(session.user.id)
    const userObj = _userObj as DatabaseUser;
    const post = _post as DatabasePost;

    console.log(userObj)
    console.log(post)

    let user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;


    const [owner, setOwner] = useState(userObj.id == post.user_id ? true : false);

    console.log(owner)

    const [isHovering, setIsHovered] = useState(false);

    const [postProfile, setPostProfile] = useState({} as DatabaseUser)

    const alt = post.userPrompt
    const postQuestion = post.givenPrompt
    const date = post.id
    const src = post.image.url
    const userPost = post.user_id
    const postLikes = post.likes ? post.likes.length : 0;

    const profileName = postProfile.name
    const profileImage = postProfile.image
    const profileLink = postProfile.id;
    const profileId = postProfile.id

    const userName = userObj ? userObj.name : '';

    const [commentfeed, setCommentfeed] = useState([] as DatabaseComment[]);
    const [checkedForComments, setCheckedForComments] = useState(false)

    const commentsLoading = commentfeed.length === 0 && !checkedForComments
    const noPosts = commentfeed.length === 0 && checkedForComments

    const [userComment, setUserComment] = useState('');

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

        if (days === 0) {
            return "Today";
        }

        else if (days === 1) {
            return "Yesterday"
        }

        else if (days <= 30) {
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

    const commentOnPost = async (event) => {

        if(userComment == ""){
            return;
        }
         const commentRetrieveTest = {
            owner_id: post.user_id,
            user_id: userObj.id,
            post_id: date,
            username: userName,
            comment: userComment,
        }

        const requesting = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentRetrieveTest)
        }

        try {
            const resp = await fetch('/api/database/posts/createComment', requesting)
            if (resp.status === 200)
                console.log("test good")
                setUserComment("");
                loadUserComments().catch(console.error);
                //window.location.reload();
        } catch (err: any) {
            console.error(err)
        }

    }


    const handleShare = async (event) => {

        //console.log(commentfeed);

        commentfeed.map((comment) => (
            console.log(comment.comment)
         ))


        // const url = post.image.url;

        // const downloadLink = document.createElement("a");
        // downloadLink.href = url;
        // downloadLink.download = post.userPrompt;
        // downloadLink.click();
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
            if (resp.status === 200)
                window.location.reload();
        } catch (err: any) {
            console.error(err)
        }
    }

    async function loadUserComments() {


        const commentTest = {
            owner_id: post.user_id,
            post_id: date,
        }

        const requesting = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentTest)
        }

        const comments = [];
        const resp = await fetch(`/api/database/posts/getPostComments`, requesting)
        const json = await resp.json() as CommentsResponse;

        

        const dbComments = json.comments;
        //setCommentfeed(dbComments);


        //console.log(dbComments);

       

        if(dbComments){
            const commentHopes = Object.keys(dbComments).map((id) => {
                return dbComments[id];
            })
            console.log(commentHopes)

            setCommentfeed(commentHopes);
        }

        setCheckedForComments(true);

    }

    useEffect(() => {

        loadUserComments().catch(console.error);

    }, [])

    const CommentObject = ({time,author,comment, username}) => 
        <li key={time}>
            <h2>{username}</h2>
            <h4>{comment}</h4>
        </li>

    useEffect(() => {

        if (imageNeedsUpdate)
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
    const imageHeight = imageRef.current ? imageRef.current.height : 0


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
                // collapsedSize={'20%'} // Uncomment when bug fixed on first load
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
                                    padding={0.5}
                                    display={'flex'}
                                    flexDirection={'column'}
                                    justifyContent={'start'}
                                    height={'30%'}
                                >
                                    <Link  href={`/${profileId}`}>
                                        <Typography 
                                            variant='navButtonText'
                                            sx={{ fontSize: { xs: 16, sm: 16, md: 18, lg: 20 } }}
                                        >
                                            @{profileName}
                                        </Typography>
                                    </Link>

                                    <Typography
                                        sx={{ fontSize: { xs: 14, sm: 14, md: 16, lg: 18 } }}
                                        color={'#bbb'}
                                        variant='navButtonText'
                                    >
                                        {generateTimeDifferenceString(convertPostIdToDateObj(post.id))}
                                    </Typography>
                                </Box>

                                <Box
                                    display={'flex'}
                                    flexDirection={'row'}
                                    justifyContent={'center'}
                                    height={'20%'}
                                    padding={1}
                                >
                                    {
                                        !userLikesPost &&
                                        <Box display={'flex'}
                                            flexDirection={'row'}
                                        >
                                            <p>{/*postLikes*/} Likes</p>
                                            <ThumbUpOffAltIcon
                                                sx={{
                                                    color: 'common.blueScheme.notWhite',
                                                    paddingRight: .5,
                                                    marginLeft: 1,
                                                    ":hover": {
                                                        cursor: 'pointer'
                                                    }
                                                }}


                                                onClick={handleLike}
                                            />
                                        </Box>
                                    }
                                    {
                                        userLikesPost &&
                                        <Box display={'flex'}
                                            flexDirection={'row'}
                                        >
                                            <p>{/*postLikes*/} Likes</p>
                                            <ThumbUpIcon
                                                sx={{
                                                    color: 'white',
                                                    paddingRight: 1,
                                                    marginLeft: 1,
                                                    ":hover": {
                                                        cursor: 'pointer'
                                                    }
                                                }}

                                                onClick={handleLike}
                                            />
                                        </Box>
                                    }
                                    {
                                        <DownloadIcon
                                            sx={{
                                                color: 'white',
                                                paddingRight: .5,
                                                ":hover": {
                                                    cursor: 'pointer'
                                                }
                                            }}

                                            onClick={handleShare}
                                        />

                                    }
                                    {
                                        owner &&
                                        <DeleteIcon
                                            sx={{
                                                color: 'white',
                                                paddingRight: .5,
                                                ":hover": {
                                                    cursor: 'pointer'
                                                }
                                            }}

                                            onClick={deletePost}
                                        />

                                    }
                                    {
                                        <Box>
                                            <RedditShareButton
                                                url={post.image.url}
                                                title={'My Latest Muse'}
                                            >
                                                <RedditIcon size={24} round />
                                            </RedditShareButton>
                                        </Box>
                                    }
                                </Box>
                            </Box>
                            <Box sx={{ marginBottom: '20%', padding: '10%' }}>
                                <Typography variant='navButtonText' fontWeight={'1000'} fontSize={25} textAlign={'center'}>
                                    Prompt: {postQuestion}
                                </Typography>
                                <br></br>
                                <br></br>
                                <Typography variant='navButtonText' fontWeight={'200000'} fontSize={18} textAlign={'center'}>
                                    {profileName} said: {post.userPrompt}

                                </Typography>
                                
                            <Box sx={{ marginBottom: '50%', padding: '10%' }}>
                                {/* <Typography variant={'h5'} textAlign={'center'}>
                                    {postQuestion}
                                </Typography>
                                <Typography variant={'h6'} textAlign={'center'}>
                                    {post.userPrompt}
                                </Typography> */}

                                    <TextField
                                        id="prompt-field"
                                        label="Place Response here"
                                        sx={{backgroundColor: 'common.blueScheme.notWhite'}}
                                        size={'medium'}
                                        fullWidth
                                        multiline
                                        onChange={(e) => setUserComment(e.target.value)}
                                        value={userComment}
                                        placeholder='Like a spoon in the wind...'
                                    ></TextField>
                                    <Button onClick={commentOnPost}>
                                        Post
                                    </Button>

                                     
                                    <List  sx={{ maxHeight: 130, height: '100%', overflow: 'auto',  padding: '10%', bgcolor: 'background.paper', }}>
                                        {
                                            commentfeed.map((comment) => (
                                                <ListItem sx={{  }}>
                                                   <ListItemText primary={
                                                   <Typography variant="body2" style={{ color: '#000000'}}>{comment.username}: {comment.comment}</Typography>
                                                   
                                                   } />
                                                </ListItem> 
                                                ))
                                        }      
                                    </List>
                                             

                            </Box>
                            <Box display={'flex'} alignContent={'center'} justifyContent={'center'}  >
                                <Button
                                    sx={{
                                        color: '#4a148c',
                                        backgroundColor: '#ffffff',
                                        borderRadius: '15px',
                                        border: '1px solid #ffffff',
                                    }}
                                >
                                    See Critiques
                                </Button>
                            </Box>
                        </Box>
                        </Box>
                    </Box>
                </Collapse>
            </Box>

        </Box>

    );

}


export default Post;
