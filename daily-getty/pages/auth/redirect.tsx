import React from 'react'

import  authOptions  from 'pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth/next'
import { useSession } from 'next-auth/react'

function Redirect() {

    const { data: session, status } = useSession()

    console.log(session)
    console.log(status)

    // console.log(session)

    return (
        <>
        TEST
        </>
    )
}

export default Redirect;