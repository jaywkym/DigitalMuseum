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
                test(session.user.id)
            }} value={'Generate Image'} />

        </>
    )
}

async function test(id) {

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
                image: resp.data[0].b64_json
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