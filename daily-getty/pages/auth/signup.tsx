import React, { useState } from 'react';
import { getAuth,
         createUserWithEmailAndPassword 
} from 'firebase/auth';
import auth from '../../firebase/config';

function SignUp() {

    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      };
      
      const [ email, setEmail ] = useState('');
      const [ password, setPassword ] = useState('');

    return (
        <>
            <input type={'text'} placeholder={'email'} value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input type={'password'} placeholder={'*********'} value={password} onChange={(e) => setPassword(e.target.value)}/>
            <input type={'button'} value={'Register'} onClick={() => {
                createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                })
                .catch(error => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode)
                    console.log(errorMessage);

                })
            }} />
        </>
    )
}

export default SignUp;