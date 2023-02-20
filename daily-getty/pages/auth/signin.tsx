import React, { useEffect, useRef, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react'
import useImage from '../dalle/images'
import Image from 'next/image';

function SignInPage() {

    const [prompt1, setPrompt] = useState('')
    const [amount, setAmount] = useState('')
    const [ b64_image, error, loading, generateImage ] = useImage(prompt1, amount);

    console.log(error);
       
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

            <input type={'text'} value={prompt1} onChange={(e) => setPrompt(e.target.value)} />
            <input type={'number'} step={'1'} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input type={'button'} onClick={generateImage} value={'Generate Image'} />

            <br></br>
            <br></br>

            {!loading && <Image src={b64_image} alt={"Base 64 Image"} width={500} height={500}></Image>}
        </>
    )
}

export default SignInPage;