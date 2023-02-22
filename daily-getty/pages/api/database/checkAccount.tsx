import { database } from "../../../firebase/clientApp";
import { getDatabase, push, ref, set, get, child } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import type { 
    DatabaseError, 
    DatabaseResponse
}  from "../../../types/FirebaseResponseTypes";

const dp = database;


export default async function checkUser (
    req: NextApiRequest,
    res: NextApiResponse<DatabaseResponse>
  ) {

    console.log("anything works?");
    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            generateResponse(
                false, 
                generateError(405, 'Invalid request method')
            )
        )
        return;
    }   

    const email = req.body.email;
    console.log("got to the email?")
    console.log(email);

    try {

        /* Fetch images from DALLE api */
        const exist  = await checkExistence(email);
        console.log("User Existence: " + exist);

        return 
        /* TODO - Handle error for successful request but invalid parameters (Invalid api key, invalid request...) */
        

    /* Return error if an error occured fetching the DALLE api */
    } catch (err: any) {
        return generateError(1, 'unknown error');
    }
}

/**
 * 
 * checkExistence: Attempts to discover whether the database sotnains a user
 * 
 * @param prompt User email to be checked for existence in the database
 * @returns boolean representing a successful or error response from DALLE
 */
async function checkExistence(email: string) {

    const dbRef = ref(getDatabase());
    get(child(dbRef, `Users/${email}`)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log("User exists")
            console.log(snapshot.val());
            return true;
        } else {
            console.log("No data available");
            return false;
        }
        }).catch((error) => {
            console.error(error);
        });
    return false;
}






/**
 * 
 * generateResponse: Generates a DatabaseResponse object from given inputs.
 * 
 * @param success Boolean to determine successful response
 * @param error A DatabaseError Object filled with error information
 * @returns DatabaseResponse
 */
function generateResponse(success: boolean, error = {} as DatabaseError): DatabaseResponse {
    return {
        success: success,
        error: error
    }
}


/**
 * 
 * generateError: Generates a DalleError object from the given parameters.
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