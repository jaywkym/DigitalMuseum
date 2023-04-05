import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Slide, { SlideProps } from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DatabasePost, DatabaseUser } from '@/types/FirebaseResponseTypes';
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

const CommentsModal = ({ _userObj, _post, session }) => {

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
    const userPost = post.user_id
    const postLikes = post.likes.length

    const profileName = postProfile.name
    const profileImage = postProfile.image
    const profileLink = postProfile.id;
    const profileId = postProfile.id

    const userName = userObj ? userObj.name : ''

    //const comments = post.comments TO BE IMPLEMENTED Should be an array of comments 

    const [open, setOpen] = useState(false);
    const [newComment, setNewComment] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNewCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewComment(event.target.value);
    };

    const handleSubmitComment = () => {
        // Add logic to submit the new comment
        console.log('Submit comment:', newComment);
        setNewComment('');
        handleClose();
    };

    return (
        <Box>
            {/* ... existing content */}
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                View Comments
            </Button>
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle sx={{ backgroundColor: '#1a237e', color: '#ffffff' }}>
                    Comments
                </DialogTitle>
                <DialogContent sx={{ backgroundColor: '#303f9f', color: '#ffffff' }}>
                    {/* Map through the comments and display each comment with user's name, profile image, and content */}
                    {/* Replace `comments` with the actual comments data */}
                    {/*
                    {comments.map((comment) => (
                        <Box key={comment.id} display="flex" alignItems="center" mb={1}>
                            <Link href={`/profile/${comment.user.id}`}>
                                <Avatar
                                    alt={comment.user.name}
                                    src={comment.user.profileImage}
                                    sx={{ cursor: 'pointer', marginRight: 1 }}
                                />
                            </Link>
                            <Typography variant="body1">
                                <strong>{comment.user.name}</strong> {comment.content}
                            </Typography>
                        </Box>
                    ))}
                    */}
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#1a237e' }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="comment"
                        label="Add a comment"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={newComment}
                        onChange={handleNewCommentChange}
                        InputProps={{ disableUnderline: true, style: { color: '#ffffff' } }}
                        InputLabelProps={{ style: { color: '#c7a4ff' } }}
                    />
                    <Button onClick={handleSubmitComment} color="primary">
                        Submit
                    </Button>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CommentsModal;