import { database } from "../../../../firebase/clientApp";
import { ref, onValue } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseResponse,
    DatabaseUser
}  from "../../../../types/FirebaseResponseTypes";

export default async function checkUser (
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

    const body = req.body as DatabaseUser;
    const user_email = body.email;

    if(user_email === undefined) {
        res.status(200).json(
            generateDbResponse(
                false,
                generateError(-10, 'No user email')
            )
        )

        return;
    }

    const db = database;
    const dbref = ref(db, 'users/')
    const users = await asyncOnValue(dbref);

    /* Check all users if email is attached to user */
    for(let user_id in users) {
        
        let user: DatabaseUser = users[user_id]

        if(user.email === user_email) {
            res.status(200).json(
                generateDbResponse(
                    true,
                    {} as DatabaseError
                )
            )

            return;
        }
    }

    res.status(200).json(
        generateDbResponse(
            false,
            generateError(-2, 'No account')
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