import { database } from "../../../../firebase/clientApp";
import { ref, onValue, set } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from 'pages/api/auth/[...nextauth]'
import type { 
    DatabaseError, 
    DatabaseUserPostResponse,
    DatabasePost,
    PostExistence,
    DatabaseResponse,
    LikesResponse,
    DatabaseComment,
    CommentsResponse,
    
}  from "../../../../types/FirebaseResponseTypes";
import { getServers } from "dns";
import { getServerSession } from "next-auth/next";

export default async function getComments (
    req: NextApiRequest,
    res: NextApiResponse<CommentsResponse>
  ) {

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            generateDbResponse(
               []
            )
        )
        
        return;
    }

    const body = req.body;

    console.log("/n/n/n")
    console.log(body);

    if(!body.post_id || !body.owner_id) {
        res.status(418).json(
            generateDbResponse(
                []
            )
        )

        return;
    }

    const post_id = body.post_id;
    const owner_id = body.owner_id;

    const db = database;
    const dbref = ref(db, `posts/${owner_id}/${post_id}/comments`)

    let comments = await asyncOnValue(dbref);


    console.log(comments)

    // if(!comments) {
    //     res.status(200).json(
    //         generateDbResponse(
    //             []
    //         )
    //     )

    //     return;
        
    // }

    //console.log(post.comments)

    res.status(200).json(
        generateDbResponse( 
            comments as any
        )
    )
    
    return;

}

function asyncOnValue(ref): Promise<DatabasePost> {

    return new Promise((resolve) => {
        onValue(ref, (snapshot) => {
            const data = snapshot.val();
            resolve(data as DatabasePost)
        })
    })
}


  /**
 * 
 * generateDbResponse: Generates an DatabaseResponse object from given inputs.
 * 
 * @param success Boolean to determine successful response
 * @param user A DatabaseUser object filled with user information
 * @param error A DatabaseError Object filled with error information
 * @returns DatabaseResponse
 */
  function generateDbResponse(
    comments: DatabaseComment[]): CommentsResponse {
   
    return {
        comments: comments
    }
}

/* 
* generateError: Generates a DatabaseError object from the given parameters.
* 
* @param code Error status code
* @param message Error status text
* @param param Optional - Parameters given that led to error
* @param type Optionsl - Type of error that occured
* @returns DatabaseError 
*/
function generateError(code: number, message: string, param = '', type = ''): DatabaseError {
    return {
        code: code,
        message: message,
        param: param,
        type: type 
    }
}

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '10mb',
      },
    },
  }
  