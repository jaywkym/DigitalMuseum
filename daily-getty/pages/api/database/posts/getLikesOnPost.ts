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
    LikesResponse
}  from "../../../../types/FirebaseResponseTypes";
import { getServers } from "dns";
import { getServerSession } from "next-auth/next";

export default async function userLikesPost (
    req: NextApiRequest,
    res: NextApiResponse<LikesResponse>
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

    if(!body.user_id || !body.post_id || !body.owner_id) {
        res.status(418).json(
            generateDbResponse(
                []
            )
        )

        return;
    }

    const user_id = body.user_id;
    const post_id = body.post_id;
    const owner_id = body.owner_id;

    const db = database;
    const dbref = ref(db, `posts/${owner_id}/${post_id}`)

    let post = await asyncOnValue(dbref);
    if(!post) {
        res.status(418).json(
            generateDbResponse(
                []
            )
        )

        return;
        
    }
    
    if(!post.likes)
        post.likes = []

    let userLiked = post.likes;

    //console.log(userLiked)

    res.status(200).json(
        generateDbResponse(
            post.likes
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
    likes: string[]): LikesResponse {
   
    return {
        likes: likes
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
  