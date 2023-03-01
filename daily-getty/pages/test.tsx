import React, { useState } from 'react';
import { useSession } from 'next-auth/react'
import { useAddPost, useGetAllPostsForUser, useGetPostForUser } from './database/utils';

function Test() {

    const [prompt, setPrompt] = useState('')
    const [amount, setAmount] = useState('')
    const {data: session, status} = useSession()
    
    let user_id = status === 'authenticated'? (session.user as any).id : "";

    const [postCreatedSuccess, postCreatedLoading, createPost] = useAddPost(user_id, 12345, "test");
    const [posts, getPostsSuccess, getPostsLoading, getAllPostsForUser] = useGetAllPostsForUser(user_id);
    const [post, getPostSuccess, getPostLoading, getPostForUser] = useGetPostForUser(user_id, "2023_2_1")

    console.log(posts)
    console.log(post)

    return (
        <>
            <p>Testing Page</p>

            <br></br>
            <br></br>

            <input type={'button'} onClick={createPost} value={'Add Post'} />
            <input type={'button'} onClick={getAllPostsForUser} value={'Get posts'} />
            <input type={'button'} onClick={getPostForUser} value={'Get post for 2023-2-1'} />

        </>
    )
}

export default Test;