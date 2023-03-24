import { database } from "../../../../firebase/clientApp";
import { ref, onValue, set } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseUserPostResponse,
    DatabasePost,
    PostExistence,
    DatabaseResponse
}  from "../../../../types/FirebaseResponseTypes";

export default async function unlikePost (
    req: NextApiRequest,
    res: NextApiResponse<DatabaseResponse>
  ) {

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            generateDbResponse(
                false, 
                generateError(405, 'Invalid request method')
            )
        )
        
        return;
    }

    const body = req.body;

    if(!body.user_id || !body.post_id) {
        res.status(418).json(
            generateDbResponse(
                false, 
                generateError(418, 'No user id or post id')
            )
        )

        return;
    }

    const user_id = body.user_id;
    const post_id = body.post_id;

    const db = database;
    const dbref = ref(db, `posts/${user_id}/${post_id}`)

    let post = await asyncOnValue(dbref);
    if(!post) {
        res.status(418).json(
            generateDbResponse(
                false, 
                generateError(418, 'Post does not exist')
            )
        )

        return;
        
    }
    
    if(!post.likes)
        post.likes = []

    let userLiked = post.likes;

    if(!userLiked.includes(user_id)) {
        res.status(200).json(
            generateDbResponse(
                false, 
                generateError(418, 'User does not like post')
            )
        )

        return;
    }

    const index = userLiked.indexOf(user_id, 0)
    userLiked.splice(index, 1);

    post.likes = userLiked;

    set(ref(db, `posts/${user_id}/${post_id}`), post)

    res.status(200).json(
        generateDbResponse(
            true, 
            {} as DatabaseError
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
    success: boolean, 
    error: DatabaseError): DatabaseResponse {
   
    return {
        success: success,
        error: error
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
  