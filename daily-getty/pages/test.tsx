import React, { useState } from 'react';
import { useSession } from 'next-auth/react'
import { useAddPost, useGetAllPostsForUser } from './database/utils';

function Test() {

    const [prompt, setPrompt] = useState('')
    const [amount, setAmount] = useState('')
    const {data: session, status} = useSession()
    
    let user_id = status === 'authenticated'? (session.user as any).id : "";

    const [postCreatedSuccess, postCreatedLoading, createPost] = useAddPost(user_id, 12345, "test");
    const [posts, getPostsSuccess, getPostsLoading, getAllPostsForUser] = useGetAllPostsForUser(user_id);

    console.log(posts)

    return (
        <>
            <p>Testing Page</p>

            <br></br>
            <br></br>

            <input type={'button'} onClick={createPost} value={'Add Post'} />
            <input type={'button'} onClick={getAllPostsForUser} value={'Get posts'} />

        </>
    )
}

export default Test;