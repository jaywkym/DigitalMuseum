import { randomBytes, randomUUID } from "crypto";
import NextAuth from 'next-auth'
import type { NextAuthOptions } from "next-auth" 
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import TwitterProvider from "next-auth/providers/twitter";
import type { 
    DatabaseResponse,
    DatabaseUser,
    DatabaseUserResponse
}  from "../../../types/FirebaseResponseTypes";

type CustomSession = {
    user: {
        name: string,
        email: string,
        image: string,
        id: string,
    },
    expires: string
}

/**
 * authOptions: Configuration for authentication through next. 
 */
export const authOptions: NextAuthOptions = {  

    secret: process.env.NEXTAUTH_SECRET,
    /* Defines the types of ways that a user can login to the platform */
    providers: [    
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
    ],

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString("hex")
          }
    },

    jwt: {
        maxAge: 60 * 60 * 24 * 30,
    },

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {

            // console.log(process.env)
  
            // console.log({
            //     user: user,
            //     account: account,
            //     profile: profile, //email verified
            //     email: email,
            //     credentials: credentials
            // })

            // return true;

            console.log("TEST")
            console.log("Checking email verified")

            // /* Reject login if email is not verified */
            // if(!(profile as any).email_verified)
            //     return true;

            // console.log("Email verified")
            // console.log("Checking account exists")

            // /* Verify if new user (Create account) */
            // const account_exists = await check_user_exists(user.email);

            // /* Log in user if their account exists */
            // if(account_exists)
            //     return true;

            // console.log("Account does not exist")

            // const userAccount: DatabaseUser = {
            //     id: randomUUID?.() ?? randomBytes(32).toString("hex"),
            //     name: user.name,
            //     email: user.email,
            //     image: user.image,
            //     googleId: user.id

            // }

            // console.log(userAccount)

            // /* Create user account if it does not exist */
            // await create_account(userAccount)

            // console.log("Account created")
            
            return true
          },

        /* Callback whenever a session token is created/updated */
          async session( {session, token} ) {

            // return session


            /* No updating needed if user id is set */
            if((session as CustomSession).user.id !== undefined)
                return session;

            /* Create new session for user with updated profile information */
            const user = {
                id: null,
                name: token.name,
                email: token.email,
                image: token.image,
                googleId: token.id
            } as DatabaseUser;

            let user_obj = await pull_user(user);

            /* Create new session object */
            const new_session = {
                user: {
                    name: user_obj.name,
                    email: user_obj.email,
                    image: user_obj.image,
                    id: user_obj.id
                },
                expires: session.expires
            } as CustomSession;

            return new_session
          },

          /* Callback whenever jwt token is created/ updated */
          async jwt( {token, user}) {
 
            /* Update token id from user id */
            if(user)
                token.id = user.id

            return token;
          }
    },

    /* Custom pages that will direct the user to the provider's login page */
    pages: {
         signIn: '/auth/signin',
    }
}

/**
 * pull_user: Takes in an incomplete user object and fills the rest of the
 *            information missing.
 * 
 * @param user An incomplete user object
 * @returns A complete user object with all parameters filled
 */
async function pull_user(user: DatabaseUser): Promise<DatabaseUser> {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user)
    }

    return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXTAUTH_URL}api/database/profile/getUserAccount`, request)
        .then(res => res.json())
        .then((resj) => {
            const res = resj as DatabaseUserResponse;

            if(res.success)
                resolve(res.user)

            resolve({} as DatabaseUser)
            
        })
        .catch(err => {
            console.log("GOT ERR")
            reject(err);
        })
    })

}

async function check_user_exists(email: string): Promise<boolean> {
    console.log("Checking for user")
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'email': email
        })
    }

    return new Promise((resolve, reject) => {
        fetch(`${process.env.NEXTAUTH_URL}api/database/profile/checkForUser`, request)
        .then(res => res.json())
        .then((resj) => {
            const res = resj as DatabaseResponse
            console.log("Received...")
            console.log(res)

            /* Log in user if account exists */
            if(res.success) 
               resolve(true)

            resolve(false)
        })
        .catch(err => {
            reject(false);
        })
    })
    
}

function create_account(userAccount: DatabaseUser) {
    const create_account_req = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userAccount)
    }

    fetch(`${process.env.NEXTAUTH_URL}api/database/profile/createUser`, create_account_req)
    .then(res => res.json())
    .then(resj => {

        const res = resj as DatabaseResponse;

    })
    .catch(err => {
        console.log(err);
    })
}

export default NextAuth(authOptions)

