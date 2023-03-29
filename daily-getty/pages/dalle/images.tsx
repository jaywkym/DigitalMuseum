import { DatabasePost } from "@/types/FirebaseResponseTypes";
import {useState, useEffect, Dispatch } from "react";
import type { 
    DalleError, 
    ImageResponse
}  from "../../types/DalleResponseTypes";

/**
 * useImage: This hook provides the functionality to generate an image from
 *           the DALLE api. The hook requires two parameters to generate the
 *           image. The image will start being generated when the generate
 *           function is called. A loading variable is also provided to signify
 *           when the image has finished generating and it is safe to use.
 * @param prompt Prompt for image
 * @param amount Amount of images requested
 * @returns [b64_image, error, loading, generate] A base64 encoded image, an error, a
 *          loading boolean, and a function to generate the image.
 */
const useImage = (prompt: string, style: string, amount: string): 
    [string[], string, boolean, DalleError, Dispatch<void>] => {

    const [image_urls, setImageUrls]: [string[], Dispatch<string[]>] = useState([] as string[]);
    const [success, setSuccess]: [boolean, Dispatch<boolean>] = useState(false);
    const [created, setCreated]: [string, Dispatch<string>] = useState('');
    const [error    , setError]: [DalleError, Dispatch<DalleError>] = useState(null);
    const [loading  , setLoading] = useState(false);

    async function generate() {

        if(!checkParams(prompt, Number.parseInt(amount)))
            return;

        if(loading)
            return;

        setLoading(true);
        setSuccess(false)

        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'prompt': prompt,
                'amount': 1
            })
        }

        const posts: string[] = []
        const promises: Promise<void>[] = [];

        /* Generate all images in parallel */
        for(let i = 0; i < parseInt(amount); ++i) {

            try {
                promises.push(fetch('/api/dalle/generate_image' , request)
                .then(async (dalle_response) => {
                    const image_response = await dalle_response.json() as ImageResponse;
                    if(!image_response.success)
                        return;
    
                    posts.push(image_response.image.data[0].url);
                }))
                
            } catch (err: any) {
                console.error(err)
            }
        }

        /* Wait for all images to finish processing before continuing */
        await Promise.all(promises);

        setImageUrls(posts)

        setSuccess(true);
        setLoading(false)

    };
    
    return [image_urls, created, loading, error, generate];
}

function checkParams(prompt: string, amount: number): boolean {
    if(prompt == '' || 
       amount === undefined ||
       prompt.length > 200 ||
       amount < 1 ||
       amount > 3) {

        return false;
    }

    return true;

}

export default useImage;