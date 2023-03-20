import { useState } from "react";
import type { 
    DatabasePost, 
    DatabaseUserPostsResponse,
    DatabaseUserPostResponse,
    DatabaseResponse,
    DatabaseUser
}  from "../../types/FirebaseResponseTypes";
import { useSession } from "next-auth/react";

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
const useAddPost = (b64: string): 
    [() => void] => {

    function generate() {
 
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'prompt': prompt,
                'amount': amount
            })
        }
    
        fetch('/api/dalle/generate_image', request)
        .then(res => res.json())
        .then(resj => {
            const res = resj as ImageResponse
            console.log(res)
            if(res.success) {
                setImage1(`data:image/png;base64, ${res.image.data[0].b64_json}`) //CHANGE HERE
                setImage2(`data:image/png;base64, ${res.image.data[1].b64_json}`)
                setImage3(`data:image/png;base64, ${res.image.data[2].b64_json}`)

            } else {
                setError(res.error)
            }

            setLoading(false);
        })
    };
    
    return [b64_image1, b64_image2, b64_image3,  error, loading, generate];
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

export default useAddPost;