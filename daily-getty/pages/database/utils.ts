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
    
    
        fetch(`${process.env.URL}/api/database/getFriends`, request)
        .then(res => res.json())
        .then(res => {
            let friends = res.friends.friends
           setFriends(friends? friends : [])
           setLoading(false)
        })
        .catch(err => {
            setLoading(false)
        })
    }

    return [friends, loading, pullFriends]
}

export function useAddFriend(id: string, friend_id: string):
    [boolean, boolean, () => void] {

        const [success, setSuccess] = useState(false);
        const [loading, setLoading] = useState(false);


        function addFriend() {
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
                    friend_id: friend_id
                })
            }
        
        
            fetch(`${process.env.URL}/api/database/addFriend`, request)
            .then(res => res.json())
            .then(res => {
            setLoading(false)
            })
            .catch(err => {
                setLoading(false)
            })
        }

    return [success, loading, addFriend];
}