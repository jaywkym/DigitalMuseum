import React from 'react';
import { signIn } from 'next-auth/react'

function SignInPage() {

    return (
        <>
            <p>Test</p>
            <button onClick={() =>{
                signIn();
            }}>Sign In</button>
        </>
    )
}

export default SignInPage;