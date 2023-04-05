import { database } from "../../../../firebase/clientApp";
import { ref, set } from "firebase/database";
import type { NextApiRequest, NextApiResponse } from 'next';
import AWS from 'aws-sdk'
import type { 
    DatabaseError, 
    DatabaseResponse,
    DatabasePost
}  from "../../../../types/FirebaseResponseTypes";

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  })

export default async function createPost (
    req: NextApiRequest,
    res: NextApiResponse<DatabaseResponse>
  ) {

    console.log("inside createPost");

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
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const post_id = year + "_" + month + "_" + day;

    const url = await uploadToAWS(body.image.url, body.user_id, post_id);
    if(url === '') {
        res.status(200).json(
            generateDbResponse(
                false, 
                generateError(192, 'Error with TinyPNG api')
            )
        )
        
        return;
    }
    
    const dbpost = {
        id: post_id,
        user_id: body.user_id,
        userPrompt: body.userPrompt,
        givenPrompt: body.givenPrompt,
        likes: body.likes,
        image: {
            created: body.image.created as Number,
            url: url as String
        } as any
    } as DatabasePost

    const db = database;

    set(ref(db, `posts/${dbpost.user_id}/${post_id}`), dbpost)

    res.status(200).json(generateDbResponse(true, {} as DatabaseError))
  
}

async function uploadToAWS(url, user_id, post_id): Promise<string> {

    try {
        const res = await fetch(url, { method : 'GET' })
        const blob = await res.blob()
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
    
        console.log(res)
        console.log(blob)
    
        const uploadedImage = await s3.upload({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${user_id}_${post_id}`,
            Body: buffer,
            ContentType: 'image/png'
        }).promise()

        // const awsSignedURL = await s3.getSignedUrl('putObject', {Bucket: process.env.AWS_S3_BUCKET_NAME, Key: uploadedImage.Key})
        // console.log(awsSignedURL)

        return `${process.env.AWS_S3_BUCKET_URL}${user_id}_${post_id}`
    } catch (err: any) {
        console.error(err)
        return ''
    }


    // const api_bytes = Buffer.from('api:'+process.env.TINY_PNG_API_KEY).toString('base64');

    // const request = {
    //     method: 'POST',
    //     headers: {
    //         Host: 'api.tinify.com',
    //         Authorization:'Basic ' + api_bytes,
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({source: {url: url}})
    // }

    // try {
    //     const tinyPNGResponse = await fetch('https://api.tinify.com/shrink', request);
    //     const headers: any = tinyPNGResponse.headers;

    //     if(tinyPNGResponse.status !== 201) {
    //         console.error("ERROR: tinyPNG returned non 201 status code")
    //         return '';
    //     }

    //     return headers.get('location')
    // } catch (err: any) {
    //     console.error(err)
    //     return ''
    // }

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
  
