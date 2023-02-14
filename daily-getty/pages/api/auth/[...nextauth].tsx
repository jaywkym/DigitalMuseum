import NextAuth from "next-auth" 
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook"
import GoogleProvider from "next-auth/providers/google";
import InstagramProvider from "next-auth/providers/instagram";
import TwitterProvider from "next-auth/providers/twitter"

type LoginCredentials = {
    username: string
    password: string
}

/**
 * authOptions: Configuration for authentication through next. 
 */
export const authOptions = {  
    secret: process.env.SECRET, // TODO - Get Jay to add a secret key to sign session/ JWT tokens

    /* Defines the types of ways that a user can login to the platform */
    providers: [    
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username or Phone Number", type: "text", placeholder: "username or phone" },
                password: { label: "Password", type: "password", placeholder: "**********" }
            },
            async authorize(credentials, req) {
                const { username, password } = credentials as LoginCredentials

                /* TODO - pull user from database. Reject if not known or
                          redirect to register page                           */

                /* TODO - DO THE LOGIN MAGIC */

                return {id: '1234'}
            }
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID as string,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        InstagramProvider({
            clientId: process.env.INSTAGRAM_CLIENT_ID as string,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET as string
        }),
        TwitterProvider({
            clientId: process.env.TWITTER_CLIENT_ID as string,
            clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
            version: "2.0",
        })
    ],

    /* Custom pages that will direct the user to the provider's login page */
    pages: {
        /* TODO - Add custom sign in pages for multiple providers. Add error
                  and sign out pages if needed */
    }
}

export default NextAuth(authOptions)