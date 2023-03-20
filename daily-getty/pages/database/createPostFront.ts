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
const useAddPost = (b64: string, user_id: string, user_prompt: string, created: string): 
    [() => void] => {

    function generatePost() {
 
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'b64': b64,
            })
        }
    
        fetch('/api/database/posts/generate_image', request)
        .then(res => res.json())
        .then(resj => {
            console.log("good!")
        })
    };
    
    return [generatePost];
}

export default useAddPost;