import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Slide, { SlideProps } from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { CommentsResponse, DatabaseComment, DatabasePost, DatabaseUser } from '@/types/FirebaseResponseTypes';
import { Fragment, useEffect, useRef, useState, forwardRef } from 'react';
import { pull_user } from '@/pages/database/profile';
import Link from 'next/link';
import { Avatar, Box, Button, Typography } from '@mui/material';


const Transition = forwardRef(function Transition(
    props: SlideProps,
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const CommentsModal = ({ _userObj, _post, session, isOpen, onCloseModal }) => {


    const userObj = _userObj as DatabaseUser;
    const post = _post as DatabasePost;

    console.log(userObj)
    console.log(post)

    const [postProfile, setPostProfile] = useState({} as DatabaseUser)

    let user: DatabaseUser = session ? session.user as DatabaseUser : {} as DatabaseUser;

    const alt = post.userPrompt
    const postQuestion = post.givenPrompt
    const date = post.id
    const src = post.image.url

    const profileName = postProfile.name
    const profileImage = postProfile.image
    const profileLink = postProfile.id;
    const profileId = postProfile.id

    const userName = userObj ? userObj.name : ''

    //const comments = post.comments TO BE IMPLEMENTED Should be an array of comments 
    const [userComment, setUserComment] = useState('');
    const [commentfeed, setCommentfeed] = useState([] as DatabaseComment[]);
    const [checkedForComments, setCheckedForComments] = useState(false)

    const commentsLoading = commentfeed.length === 0 && !checkedForComments
    const noPosts = commentfeed.length === 0 && checkedForComments

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

        if (dbComments) {
            const commentHopes = Object.keys(dbComments).map((id) => {
                return dbComments[id];
            })
            setCommentfeed(commentHopes);
        }
        setCheckedForComments(true);
    }

    const commentOnPost = async (event) => {

        if (userComment == "") {
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
                setUserComment("");
            loadUserComments().catch(console.error);
            //window.location.reload();
        } catch (err: any) {
            console.error(err)
        }

    }

    const [newComment, setNewComment] = useState('');

    const handleNewCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleSubmitComment = () => {
        // Add logic to submit the new comment
        console.log('Submit comment:', newComment);
        setNewComment('');
    };

    useEffect(() => {
        loadUserComments().catch(console.error);
    }, [])

    return (
        <Box>
            <Dialog
                open={isOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={onCloseModal}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#0c181f',
                        borderRadius: 2, // Adjust this value to change the roundness of the corners
                    },
                }}
            >
                <DialogTitle sx={{ backgroundColor: '#0c181f', color: '#ffffff' }}>
                    Comments
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#060c0f', color: '#ffffff' }}>
                    {/* Map through the comments and display each comment with user's name, profile image, and content */}
                    {/* Replace `comments` with the actual comments data */}
                    <Box sx={{ m: 2 }}>
                        {
                            commentfeed.map((comment, index) => (
                                <Box sx={{ m: 1 }} key={index} display="flex" alignItems="center" mb={1}>
                                    {
                                        /*
                                        <Link href={`/profile/${comment.username}`}>
                                        {/
                                        <Avatar
                                            alt={comment.username}
                                            src={comment.user.profileImage}
                                            sx={{ cursor: 'pointer', marginRight: 1 }}
                                        />
                                        }
                                    </Link>*/
                                    }

                                    <Typography variant="body1">
                                        <strong>{comment.username}: </strong> {comment.comment}
                                    </Typography>
                                </Box>
                            ))
                        }

                        {
                            commentsLoading &&
                            <Typography variant="body1">
                                <strong>Critques loading...</strong>
                            </Typography>
                        }

                        {
                            noPosts &&
                            <Box sx={{ m: 3 }}>
                                <Typography variant="body1">
                                    <strong>No Critiques Yet</strong>
                                </Typography>
                            </Box>
                        }

                    </Box>

                    <TextField
                        id="prompt-field"
                        label="Place Response here"
                        sx={{ backgroundColor: 'common.blueScheme.notWhite' }}
                        size={'medium'}
                        fullWidth
                        multiline
                        onChange={(e) => setUserComment(e.target.value)}
                        value={userComment}
                        placeholder='Ages like eggs...'
                    ></TextField>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#0c181f' }}>
                    <Button onClick={commentOnPost} color="primary">
                        Submit
                    </Button>
                    <Button onClick={onCloseModal} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CommentsModal;
