import NextAuth from "next-auth" 
import CredentialsProvider from "next-auth/providers/credentials"

type LoginCredentials = {
    username: string
    password: string
}

export const authOptions = {  
    secret: process.env.SECRET,
    providers: [    
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username or Phone Number", type: "text", placeholder: "username or phone" },
                password: { label: "Password", type: "password", placeholder: "**********" }
            },
            authorize(credentials, req) {
                const { username, password } = credentials as LoginCredentials

                /* TODO - pull user from database. Reject if not known or
                          redirect to register page                           */

                /* TODO - DO THE LOGIN MAGIC */

                return {id: '1234'}
            }
        }) 
    ],
    pages: {
        /* TODO - Add custom sign in pages for multiple providers. Add error
                  and sign out pages if needed */
    }
}

export default NextAuth(authOptions)