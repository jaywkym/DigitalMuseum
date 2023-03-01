import React, { useEffect, useRef, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react'
import fs from 'fs'
import Image from 'next/image';

function SignInPage() {

    const [prompt, setPrompt] = useState('')
    const [amount, setAmount] = useState('')
    const {data: session, status} = useSession()
    console.log(session)

    return (
        <>
            <p>Testing Page</p>

            <br></br>
            <br></br>

            <input type={'button'} onClick={() => {
                addPost(session.user.id)
            }} value={'Generate Image'} />
            <input type={'button'} onClick={() => {
                requestAllPostsFromUser(session.user.id)
            }} value={'Get posts'} />

        </>
    )
}

async function requestAllPostsFromUser(id) {

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: id,
        })
    }

    fetch('http://localhost:3000/api/database/getAllPostsFromUser', request)
    .then(res => res.json())
    .then(res => {
       console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
}

async function addPost(id) {

    const json = await fetch(`/test/output.json`)
    const resp = await json.json()
    

    const request = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            image: {
                created: resp.created,
                image: resp.data[1].b64_json
            }
        })
    }

    console.log(request)

    fetch('http://localhost:3000/api/database/createPost', request)
    .then(res => res.json())
    .then(res => {
       console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
}

export default SignInPage;