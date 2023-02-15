import React, { useEffect, useRef, useState } from 'react';
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image';

type ImageResponse = {
    success: boolean,
    amount : number,
    image  : DalleResponse,
    error  : DalleError,
}

type DalleResponse = {
    created: number,
    data   : {
        b64_json: string
    }[],
    success: boolean
}

type DalleError = {
    code: number,
    message: string,
    param: string,
    type: string 
}

function SignInPage() {

    const [b64_image, setImage ] = useState('')
    const [prompt, setPrompt] = useState('')
    const [amount, setAmount] = useState('')


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
            <input type={'button'} onClick={() => {
               const request = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        'prompt': prompt,
                        'amount': amount
                    })
                }
        
                console.log("Fetching image")
                console.log(request)
            
                fetch('/api/dalle/generate_image', request)
                .then(res => res.json())
                .then(resj => {
                    const res = resj as ImageResponse
                    console.log(res)
                    if(res.success) {
                        setImage(`data:image/png;base64, ${res.image.data[0].b64_json}`)
                    }
                })
        
            }} value={'Generate Image'} />

            <br></br>
            <br></br>

            <Image src={b64_image} alt={"Base 64 Image"} width={500} height={500}></Image>
        </>
    )
}

export default SignInPage;