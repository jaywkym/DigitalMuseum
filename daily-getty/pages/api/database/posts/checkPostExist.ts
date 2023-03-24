import { database } from "../../../../firebase/clientApp";
import { ref, onValue, set } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseUserPostResponse,
    DatabasePost,
    PostExistence
}  from "../../../../types/FirebaseResponseTypes";

export default async function checkPost (
    req: NextApiRequest,
    res: NextApiResponse<PostExistence>
  ) {

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            generateDbResponse(
                false, 
                true,
                generateError(405, 'Invalid request method')
            )
        )
        
        return;
    }

    const body = req.body;
    const user_id = body.user_id
    const post_id = body.post_id

    console.log(user_id);
    console.log(post_id);
    const db = database;
    const dbref = ref(db, `posts/${user_id}/${post_id}`)

    let post = await asyncOnValue(dbref);
    let exist;

    if(post === null){
        //post = {} as DatabasePost
        exist = false;
    }
    else{
        exist = true;
    }
       

    res.status(200).json(generateDbResponse(true, exist, {} as DatabaseError))

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
    exist: boolean,
    error: DatabaseError): PostExistence {
   
    return {
        success: success,
        exist: exist,
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
  