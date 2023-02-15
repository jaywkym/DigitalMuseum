import {useState, useEffect, Dispatch } from "react";
import type { 
    DalleError, 
    ImageResponse
}  from "../../types/DalleResponseTypes";

/**
 * useImage: This hook provides the functionality to generate an image from
 *           the DALLE api. The hook requires two parameters to generate the
 *           image. The image will actually be generated when the generate
 *           function is called.
 * @param prompt Prompt for image
 * @param amount Amount of images requested
 * @returns [b64_image, error, generate] A base64 encoded image, an error, a
 *          function to generate the image.
 */
const useImage = (prompt: string, amount: string): 
    [string, DalleError, () => void] => {

    const [b64_image, setImage] = useState(null);
    const [error    , setError]: [DalleError, Dispatch<DalleError>] = useState(null);

    function generate() {

        if(!checkParams(prompt, Number.parseInt(amount)))
            return;

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
            if(res.success) {
                setImage(`data:image/png;base64, ${res.image.data[0].b64_json}`)
            } else {
                setError(res.error)
            }
        })
    };
    
    return [b64_image, error, generate];
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