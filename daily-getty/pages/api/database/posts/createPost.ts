import { database } from "../../../../firebase/clientApp";
import { ref, onValue, set } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseResponse,
    DatabasePost,
    DatabaseUserResponse,
    DatabaseUser
}  from "../../../../types/FirebaseResponseTypes";

export default async function createPost (
    req: NextApiRequest,
    res: NextApiResponse<DatabaseResponse>
  ) {

    /* Only accept POST requests */
    if(req.method !== 'PUT') {
        res.status(405).json(
            generateDbResponse(
                false, 
                generateError(405, 'Invalid request method')
            )
        )
        
        return;
    }

    const body = req.body;
   
    const date = new Date();
    const post_id = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`

    //console.log(body);
    
    const dbpost = {
        id: post_id,
        user_id: body.user_id,
        userPrompt: body.userPrompt,
        givenPrompt: null,
        likes: body.likes,
        image: {
            created: body.image.created as Number,
            b64: body.image.b64 as String
        } as any
    } as DatabasePost

    const db = database;

    set(ref(db, `posts/${dbpost.user_id}/${post_id}`), dbpost)

    res.status(200).json(generateDbResponse(true, {} as DatabaseError))
  
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
  
