import { database } from "../../../firebase/clientApp";
import { ref, onValue, set } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseResponse,
    DatabasePost
}  from "../../../types/FirebaseResponseTypes";

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
    console.log((new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)).getTime())

    // const dbpost = {
    //     id: (new Date(date.getFullYear(), date.getMonth(), date.getDate())).getTime(),
    //     image: {
    //         created: body.created,
    //         image: body.b64_image
    //     }
    // } as DatabasePost



    res.status(200).json({success: true} as DatabaseResponse)


  
  
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
  