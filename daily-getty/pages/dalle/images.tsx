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
const useImage = (prompt: string, amount: string): 
    [string, DalleError, boolean, () => void] => {

    const [b64_image, setImage]: [string, Dispatch<string>] = useState('');
    const [error    , setError]: [DalleError, Dispatch<DalleError>] = useState(null);
    const [loading  , setLoading]: [boolean, Dispatch<boolean>] = useState(false);

    function generate() {

        if(!checkParams(prompt, Number.parseInt(amount)))
            return;

        if(loading)
            return;

        setLoading(true);

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

            setLoading(false);
        })
    };
    
    return [b64_image, error, loading, generate];
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