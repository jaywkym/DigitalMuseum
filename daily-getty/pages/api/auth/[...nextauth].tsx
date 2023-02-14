import NextAuth from "next-auth" 
import CredentialsProvider from "next-auth/providers/credentials"

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
        }) 
    ],

    /* Custom pages that will direct the user to the provider's login page */
    pages: {
        /* TODO - Add custom sign in pages for multiple providers. Add error
                  and sign out pages if needed */
    }
}

export default NextAuth(authOptions)