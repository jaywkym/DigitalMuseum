import { database } from "../../../firebase/clientApp";
import { ref, onValue, set } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseResponse,
    DatabaseFriends
}  from "../../../types/FirebaseResponseTypes";

export default async function getFriends (
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

    const user_id = req.body.id;
    const friend_id = req.body.friend_id

    // const db = database;
    // const dbref = ref(db, `friends/${user_id}`)
    const friends_obj: DatabaseFriends = await getFriendsForUserById(user_id)

    console.log(friends_obj)
    if(!friends_obj.friends)
        friends_obj.friends = [];

    if(friends_obj.friends.includes(friend_id)) {
        res.status(200).json(
            generateDbResponse(
                false,
                generateError(-100, "User is already a friend")
            )
        )
        return;
    }


    friends_obj.friends.push(friend_id)
    console.log(friends_obj)

    const db = database;
    set(ref(db, `friends/${user_id}`), friends_obj)

    res.status(200).json(
        generateDbResponse(
            true,
            {} as DatabaseError
        )
    )
   
  
}

async function getFriendsForUserById(id: string): Promise<DatabaseFriends> {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id
        })
    }
    
    return new Promise((resolve, reject) => {
        fetch('http://localhost:3000/api/database/getFriends', request)
        .then(res => res.json())
        .then(res => {
           resolve(res.friends)
        })
        .catch(err => {
            reject(err)
        })
    })

}


function asyncOnValue(ref): Promise<DatabaseFriends> {

    return new Promise((resolve) => {
        onValue(ref, (snapshot) => {
            const data = snapshot.val();
            resolve(data as DatabaseFriends)
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