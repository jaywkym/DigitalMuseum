import { randomBytes, randomUUID } from "crypto";
import NextAuth from 'next-auth'
import type { NextAuthOptions } from "next-auth" 
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import TwitterProvider from "next-auth/providers/twitter"

type LoginCredentials = {
    username: string
    password: string
}

type SignInResponse = {
    user: string,
    account: string,
    profile: string,
    email: string,
    credentials: string
}

type User = {
    uuid: string,
    email: string,
    google_id: string,
    username: string,
    profile_picture: string,
    friends: User[],
    create_time: number
}

type CustomUserToken = {
    user_id: string,
    email  : string,
    username : string
}

type CustomSession = {
    user: {
        name: string,
        email: string,
        image: string,
        id: string,
    },
    expires: string
}

type Post = {
    prompt: string,
    image : string,
    likes : number,
    user_id: string,
}

type Friends = {

}

/**
 * authOptions: Configuration for authentication through next. 
 */
const authOptions: NextAuthOptions = {  
   // TODO - Get Jay to add a secret key to sign session/ JWT tokens

    /* Defines the types of ways that a user can login to the platform */
    providers: [    
        // CredentialsProvider({
        //     name: 'Credentials',
        //     credentials: {
        //         username: { label: "Username or Phone Number", type: "text", placeholder: "username or phone" },
        //         password: { label: "Password", type: "password", placeholder: "**********" }
        //     },
        //     async authorize(credentials, req) {
        //         const { username, password } = credentials as LoginCredentials

        //         /* TODO - pull user from database. Reject if not known or
        //                   redirect to register page                           */

        //         /* TODO - DO THE LOGIN MAGIC */

        //         return {id: '1234'}
        //     }
        // }),
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_CLIENT_ID as string,
        //     clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
        // }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        // InstagramProvider({
        //     clientId: process.env.INSTAGRAM_CLIENT_ID as string,
        //     clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string
        // }),
        // TwitterProvider({
        //     clientId: process.env.TWITTER_CLIENT_ID as string,
        //     clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
        //     version: "2.0",
        // })
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
        // You can define your own encode/decode functions for signing and encryption
    },

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            // console.log("Signin")
            // console.log({
            //     user: user,
            //     account: account,
            //     profile: profile,
            //     email: email,
            //     credentials: credentials
            // })

            /* TOTO - Verify if new user (Create account) */

            /* TODO - Check if user has account (use google id/ google email) */

            /* TODO - Pull account info from the database */

            /* TODO - If account does not exist --> Create account from google info */

            return true
          },
        //   async redirect({ url, baseUrl }) {
        //     console.log(url)
        //     return url
        //   },
        /* Callback whenever a session token is created/updated */
          async session( {session, token} ) {

            // console.log("Session updated!")

            /* Create new session object */
            const new_session = {
                user: {
                    name: token.name,
                    email: token.email,
                    image: token.picture,
                    id: token.id
                },
                expires: session.expires
            } as CustomSession;

            // console.log(new_session)

            return new_session
          },

          /* Callback whenever jwt token is created/ updated */
          async jwt( {token, user}) {
            
            // console.log("JWT updated")
 
            /* Update token id from user id */
            if(user)
                token.id = user.id

            return token;
          }
    },

    /* Custom pages that will direct the user to the provider's login page */
    pages: {
        // signIn: '/auth/signin',
        /* TODO - Add custom sign in pages for multiple providers. Add error
                  and sign out pages if needed */
    }
}

export default NextAuth(authOptions)