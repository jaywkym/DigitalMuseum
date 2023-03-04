import { database } from "../../../../firebase/clientApp";
import { ref, onValue } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseUserResponse,
    DatabaseUser
}  from "../../../../types/FirebaseResponseTypes";

export default async function getUserAccount (
    req: NextApiRequest,
    res: NextApiResponse<DatabaseUserResponse>
  ) {

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            generateDbUserResponse(
                false, 
                {} as DatabaseUser,
                generateError(405, 'Invalid request method')
            )
        )
        
        return;
    }

    const body = req.body as DatabaseUser;

    const db = database;
    const dbref = ref(db, 'users/')
    const users = await asyncOnValue(dbref);

    let user = {} as DatabaseUser;

    /* Check all users if email is attached to user */
    for(let user_id in users) {

        let current_user: DatabaseUser = users[user_id];

        /* Search from email */
        if(body.email && current_user.email === body.email) {
            res.status(200).json(
                generateDbUserResponse(
                    true,
                    current_user,
                    {} as DatabaseError
                )
            )

            return
        }

        /* Search from google id*/
        else if(body.googleId && current_user.googleId !== undefined && current_user.googleId == body.googleId) {
            res.status(200).json(
                generateDbUserResponse(
                    true,
                    current_user,
                    {} as DatabaseError
                )
            )
    
            return
        }
        
    }

    res.status(200).json(
        generateDbUserResponse(
            true,
            {} as DatabaseUser,
            {} as DatabaseError
        )
    )
  
}

function asyncOnValue(ref): Promise<DatabaseUser> {

    return new Promise((resolve) => {
        onValue(ref, (snapshot) => {
            const data = snapshot.val();
            resolve(data as DatabaseUser)
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
    user   : DatabaseUser,
    error: DatabaseError): DatabaseUserResponse {
   
    return {
        success: success,
        user: user,
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