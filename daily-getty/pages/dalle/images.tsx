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
    [string, string, string, string, string, string, DalleError, boolean, boolean, boolean, () => void] => {

    const [b64_image1, setImage1]: [string, Dispatch<string>] = useState('');
    const [b64_image2, setImage2]: [string, Dispatch<string>] = useState('');
    const [b64_image3, setImage3]: [string, Dispatch<string>] = useState('');
    const [created1, setCreated1]: [string, Dispatch<string>] = useState('');
    const [created2, setCreated2]: [string, Dispatch<string>] = useState('');
    const [created3, setCreated3]: [string, Dispatch<string>] = useState('');
    const [error    , setError]: [DalleError, Dispatch<DalleError>] = useState(null);
    const [loading1  , setLoading1] = useState(false);
    const [loading2  , setLoading2] = useState(false);
    const [loading3  , setLoading3] = useState(false);

    function generate() {

        if(!checkParams(prompt, Number.parseInt(amount)))
            return;

        if(loading1 || loading2 || loading3)
            return;

        setLoading1(true);
        setLoading2(true);
        setLoading3(true);

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
            const res = resj
            console.log(res)
            if(res.success) {
                //console.log(res);
                setImage1(`data:image/png;base64, ${res.image.data[0].b64_json}`) 
                setCreated1(`${res.image.created}`) 
            } else {
                setError(res.error)
            }

            setLoading1(false);
        })

        fetch('/api/dalle/generate_image', request)
        .then(res => res.json())
        .then(resj => {
            const res = resj
            console.log(res)
            if(res.success) {
                //console.log(res);

                setImage2(`data:image/png;base64, ${res.image.data[0].b64_json}`)
                setCreated2(`${res.image.created}`)
            } else {
                setError(res.error)
            }

            setLoading2(false);
        })

        fetch('/api/dalle/generate_image', request)
        .then(res => res.json())
        .then(resj => {
            const res = resj
            console.log(res)
            if(res.success) {
                //console.log(res);
                setImage3(`data:image/png;base64, ${res.image.data[0].b64_json}`)
                setCreated3(`${res.image.created}`)

            } else {
                setError(res.error)
            }

            setLoading3(false);
        })
    };
    
    return [b64_image1, b64_image2, b64_image3, created1, created2, created3,  error, loading1, loading2, loading3, generate];
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