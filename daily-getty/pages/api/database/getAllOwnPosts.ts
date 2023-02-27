import { database } from "../../../firebase/clientApp";
import { ref, onValue, Database } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseResponse,
    DatabaseImage
}  from "../../../types/FirebaseResponseTypes";

// export default async function getOwnPosts (
//     req: NextApiRequest,
//     res: NextApiResponse<DatabaseFriendsResponse>
//   ) {

//     /* Only accept POST requests */
//     if(req.method !== 'POST') {
//         res.status(405).json(
//             generateDbFriendsResponse(
//                 false, 
//                 {} as DatabaseFriends,
//                 generateError(405, 'Invalid request method')
//             )
//         )
        
//         return;
//     }

//     const user_id = req.body.id;

//     const db = database;
//     const dbref = ref(db, `posts/${user_id}`)
//     const friends_obj = await asyncOnValue(dbref);

//     res.status(200).json(
//         generateDbFriendsResponse(
//             true,
//             friends_obj,
//             {} as DatabaseError
//         )
//     )
   
  
// }

// function asyncOnValue(ref): Promise<DatabaseFriends> {

//     return new Promise((resolve) => {
//         onValue(ref, (snapshot) => {
//             const data = snapshot.val();
//             resolve(data as DatabaseFriends)
//         })
//     })
// }

//   /**
//  * 
//  * generateDbResponse: Generates an DatabaseResponse object from given inputs.
//  * 
//  * @param success Boolean to determine successful response
//  * @param user A DatabaseUser object filled with user information
//  * @param error A DatabaseError Object filled with error information
//  * @returns DatabaseResponse
//  */
// function generateDbFriendsResponse(
//     success: boolean, 
//     friends: DatabaseFriends,
//     error: DatabaseError): DatabaseFriendsResponse {
   
//     return {
//         success: success,
//         friends: friends,
//         error: error
//     }
// }

// /* 
// * generateError: Generates a DatabaseError object from the given parameters.
// * 
// * @param code Error status code
// * @param message Error status text
// * @param param Optional - Parameters given that led to error
// * @param type Optionsl - Type of error that occured
// * @returns DatabaseError 
// */
// function generateError(code: number, message: string, param = '', type = ''): DatabaseError {
//     return {
//         code: code,
//         message: message,
//         param: param,
//         type: type 
//     }
// }