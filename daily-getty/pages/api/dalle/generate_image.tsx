// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

require('dotenv').config()

const DALLE_API_KEY = process.env.DALLE_API_KEY
const url = 'https://api.openai.com/v1/images/generations'

type DalleResponse = {
    created: number,
    data   : {
        b64_json: string
    }[],
    success: boolean
}

type DalleError = {
    code: number,
    message: string,
    param: string,
    type: string 
}

type ImageResponse = {
  success: boolean,
  amount : number,
  image  : DalleResponse,
  error  : DalleError,
}

/**
 * 
 * request_image_handler: A request handler for the endpoint /api/dalle/generate)image.
 *                        Attempts to generate an AI image of the given prompt. Returns
 *                        ImageResponse object on success with retrieved image with the
 *                        image attribute filled. On error returns Image Response object
 *                        with the error field filled.
 * 
 * @param req Request from client
 * @param res Response to client
 * @returns 
 */
export default async function request_image_handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageResponse>
) {

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json(
            generateImageResponse(
                false, 
                0, 
                undefined, 
                generateError(405, 'Invalid request method')
            )
        )
        
        return;
    }

    const prompt = req.body.prompt;
    const amount = req.body.amount;

    const image  = await requestDalleImages(prompt, amount);

    /* ERROR generating image for various reasons */
    if(!image.success) {

        res.status(200).json(generateImageResponse(false, amount, undefined, image))

        return;
    } 

    /* Respond with image information */
    res.status(200).json(generateImageResponse(true, amount, image))
    
}

/**
 * 
 * reqeustDalleImages: Attempts to request AI images from DALLE given a user
 *                     prompt. Returns a DalleResponse object that contains
 *                     either an array of base 64 encoded images or an error.
 * 
 * @param prompt User text to be generated into an image
 * @param amount Amount of images to request from DALLE
 * @returns DalleResponse representing a successful or error response from DALLE
 */
async function requestDalleImages(prompt: string, amount: string) {

    /* Generate dalle post request information */
    const dalle_request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${DALLE_API_KEY}`
        },
        body: JSON.stringify({
            'prompt': prompt,
            'n'     : Number.parseInt(amount),
            'size'  : "1024x1024",
            'response_format': 'b64_json'
        })
    }

    try {

        /* Fetch images from DALLE api */
        const resp = await fetch(url, dalle_request);
        const json = await resp.json()

        /* TODO - Handle error for successful request but invalid parameters (Invalid api key, invalid request...) */
        if(json.error) {
            json.error.success = false
            return json.error
        }

        json.success = true
        return json as DalleResponse

    /* Return error if an error occured fetching the DALLE api */
    } catch (err: any) {
        return generateError(1, 'unknown error');
    }
}

/**
 * 
 * generateImageResponse: Generates an ImageResponse object from given inputs.
 * 
 * @param success Boolean to determine successful response
 * @param amount Amount of images generated
 * @param image A DalleResponse Object filled with image information
 * @param error A DalleError Object filled with error information
 * @returns ImageResponse
 */
function generateImageResponse(success: boolean, 
                               amount : number, 
                               image = {} as DalleResponse, 
                               error = {} as DalleError): ImageResponse {
    return {
        success: success,
        amount: amount,
        image: image,
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
 * @returns DalleError 
 */
function generateError(code: number, message: string, param = '', type = ''): DalleError {
    return {
        code: code,
        message: message,
        param: param,
        type: type 
    }
}