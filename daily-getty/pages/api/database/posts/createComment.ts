import { database } from "../../../../firebase/clientApp";
import { ref, set, push } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk'
import type { 
    DatabaseError, 
    DatabaseResponse,
    DatabasePost,
    DatabaseComment
}  from "../../../../types/FirebaseResponseTypes";
import { ConstructionOutlined } from "@mui/icons-material";

export default async function createPost (
    req: NextApiRequest,
    res: NextApiResponse<DatabaseResponse>
  ) {

    console.log("inside createComment");

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

    
   
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const post_id = body.post_id

    console.log("testing post_id comment")
    console.log(post_id);


    const time = String(date.getTime());

    const owner = body.owner_id

    //console.log(time)

    //const post_id = year + "_" + month + "_" + day;

    
    const dbcomment = {
        time: time,
        user_id: body.user_id,
        username: body.username,
        comment: body.comment,
    } as DatabaseComment

    const db = database;

    set(ref(db, `posts/${owner}/${post_id}/comments/${time}`), dbcomment)

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
  
