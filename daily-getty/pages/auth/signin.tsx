import React, { useEffect, useRef, useState } from 'react';
import { signIn, signOut } from 'next-auth/react'
import useImage from '../dalle/images'
import Image from 'next/image';

function SignInPage() {

    const [prompt, setPrompt] = useState('')
    const [amount, setAmount] = useState('')
    const [ b64_image, error, generateImage ] = useImage(prompt, amount);

    return (
        <>
            <p>Test Login Page</p>
            <button onClick={() =>{
                signIn();
            }}>Sign In</button>
            <button onClick={() => {
                signOut();
            }}>Sign Out</button>

            <br></br>
            <br></br>

            <input type={'text'} value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
            <input type={'number'} step={'1'} value={amount} onChange={(e) => setAmount(e.target.value)}/>
            <input type={'button'} onClick={generateImage} value={'Generate Image'} />

            <br></br>
            <br></br>

            <Image src={b64_image !== null? b64_image : "/"} alt={"Base 64 Image"} width={500} height={500}></Image>
        </>
    )
}

export default SignInPage;