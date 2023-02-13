// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

require('dotenv')

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
    code: string,
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

export default async function request_image_handler(
  req: NextApiRequest,
  res: NextApiResponse<ImageResponse>
) {

    /* Only accept POST requests */
    if(req.method !== 'POST') {
        res.status(405).json({
            success: false,
            amount: 0,
            image: {} as DalleResponse,
            error: {} as DalleError
        })
        return;
    }

    const prompt = req.body.prompt;
    const amount = req.body.amount;
    const image  = await requestDalleImages(prompt, amount);

    /* ERROR generating image for various reasons */
    if(!image.success) {
        const image_response: ImageResponse = {
            success: false,
            amount : amount,
            image  : {} as DalleResponse,
            error  : image,
        }

        res.status(200).json(image_response)
        return;
    } 

    /* Respond with image information */
    const image_response: ImageResponse = {
        success: true,
        amount: amount,
        image: image,
        error: {} as DalleError
    }

    res.status(200).json(image_response)
    
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
        method: 'get',
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


        if(json.error) {
            /* TODO - Handle error for successful request but invalid parameters (Invalid api key, invalid request...) */
            json.error.success = false
            return json.error
        }

        json.success = true
        return json as DalleResponse

    /* Return error if an error occured fetching the DALLE api */
    } catch (err: any) {
        err.data.success = false
        return err.data
    }
}