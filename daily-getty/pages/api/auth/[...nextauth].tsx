import { randomBytes, randomUUID } from "crypto";
import NextAuth from 'next-auth'
import type { NextAuthOptions } from "next-auth" 
import GoogleProvider from "next-auth/providers/google";
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

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');


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

            /* Reject login if email is not verified */
            if(!(profile as any).email_verified)
                return false;

            console.log("Checking email verified")

            /* Reject login if email is not verified */
            if(!(profile as any).email_verified)
                return false;

            console.log("Email verified")
            console.log("Checking account exists")

            /* Verify if new user (Create account) */
            const account_exists = await check_user_exists(user.email);

            console.log("Account exists: " + account_exists)
            /* Log in user if their account exists */
            if(account_exists)
                return true;

            const userAccount: DatabaseUser = {
                id: randomUUID?.() ?? randomBytes(32).toString("hex"),
                name: user.name,
                email: user.email,
                image: user.image,
                googleId: user.id
            }

            console.log(userAccount)

            console.log("Creating account...")

            /* Create user account if it does not exist */
            const resp = await create_account(userAccount)

            if(!resp) {
                console.log("ERR: Could not create account")
                return false;
            }

            console.log("Account created")
            
            return true
          },

            /* Callback whenever a session token is created/updated */
          async session( {session, token} ) {

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

    try {
        const resp = await fetch(`${process.env.NEXTAUTH_URL}api/database/profile/getUserAccount`, request)
        const json = await resp.json() as DatabaseUserResponse;
        if(json.error)
            return json.user;

        return {} as DatabaseUser;
    } catch (err: any) {

        console.error("ERR in pull_user")
        console.error(err)

        return {} as DatabaseUser
    }

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

    console.log("Sending request in check_user_exists")
    console.log(request)

    try {
        const resp = await fetch(`${process.env.NEXTAUTH_URL}api/database/profile/checkForUser`, request);
        const dbResponse = await resp.json() as DatabaseResponse;

        return dbResponse.success;

    } catch (err: any) {
        console.error("ERR: In fetch check_user_exists")
        console.error(err)
        return false;
    }
    
}

async function create_account(userAccount: DatabaseUser): Promise<Boolean> {
    const create_account_req = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userAccount)
    }

    try {
        const resp = await fetch(`${process.env.NEXTAUTH_URL}api/database/profile/createUser`, create_account_req)
        const dbResponse = await resp.json() as DatabaseResponse;

        return dbResponse.success;
    } catch (err: any) {
        console.error("ERR: In fetch from create_account")
        console.error(err);

        return false;
    }
}

export default NextAuth(authOptions)