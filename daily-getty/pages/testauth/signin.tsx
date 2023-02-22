import React, { useEffect, useRef, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react'
import useImage from '../dalle/images'
import Image from 'next/image';

function SignInPage() {

    const [prompt, setPrompt] = useState('')
    const [amount, setAmount] = useState('')
    const [ b64_image, error, generateImage ] = useImage(prompt, amount);

    return (
        <>
            <p>Test AUTH Login Page</p>
            <button onClick={() =>{
                signIn();
            }}>Sign In</button>
            <button onClick={() => {
                signOut();
            }}>Sign Out</button>

            <br></br>
            <br></br>
<<<<<<< HEAD

            <input type={'text'} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <input type={'number'} step={'1'} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input type={'button'} onClick={test} value={'Generate Image'} />

            <br></br>
            <br></br>

            <Image src={b64_image !== null? b64_image : "/"} alt={"Base 64 Image"} width={500} height={500}></Image>
=======
>>>>>>> dbdd516d12d6b185f5aede2a6708fb44c82a72a1
        </>
    )
}

function test() {

    

    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({

        })
    }

    fetch('/api/database/testdb', request)
    .then(res => res.json())
    .then(res => {
       console.log(res)
    })
    .catch(err => {
        console.log(err)
    })
}

export default SignInPage;