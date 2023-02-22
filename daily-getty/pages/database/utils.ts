import { useState } from "react";


export default function useFriends(id: string):
    [string[], boolean, () => void]{
    
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(false);

    function pullFriends() {

        if(loading)
            return;

        setLoading(true);

        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            })
        }
    
    
        fetch('http://localhost:3000/api/database/getFriends', request)
        .then(res => res.json())
        .then(res => {
           setFriends(res.friends.friends)
           setLoading(false)
        })
        .catch(err => {
            console.log(err)
            setLoading(false)
        })
    }

    return [friends, loading, pullFriends]
}