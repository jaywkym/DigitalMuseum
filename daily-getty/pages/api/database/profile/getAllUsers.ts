import { database } from "../../../../firebase/clientApp";
import { ref, onValue } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseUserResponse,
    DatabaseUser,
    DatabaseUsersResponse
}  from "../../../../types/FirebaseResponseTypes";

export default async function getAllUsers (
    req: NextApiRequest,
    res: NextApiResponse<DatabaseUsersResponse>
  ) {

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            generateDbUserResponse(
                false, 
                {} as DatabaseUser[],
                generateError(405, 'Invalid request method')
            )
        )
        
        return;
    }

    const db = database;
    const dbref = ref(db, 'users/')
    const users: DatabaseUser[] = await asyncOnValue(dbref);

    res.status(200).json(
        generateDbUserResponse(
            true,
            users,
            {} as DatabaseError
        )
    )
  
}

function asyncOnValue(ref): Promise<DatabaseUser[]> {

    return new Promise((resolve) => {
        onValue(ref, (snapshot) => {
            const data = snapshot.val();
            resolve(data as DatabaseUser[])
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
function generateDbUserResponse(
    success: boolean, 
    user   : DatabaseUser[],
    error: DatabaseError): DatabaseUsersResponse {
   
    return {
        success: success,
        users: user,
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