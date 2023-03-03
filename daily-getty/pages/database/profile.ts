import { useState } from "react";
import type { 
    DatabaseResponse
}  from "../../types/FirebaseResponseTypes";

/**
 * useFriends: Hook to retreive all the friends of a user given an ID.
 * 
 * @param user_id ID of user to retrieve all friends    
 * @returns Nothing... Why does everyone always expect me to return something.
 */
export function useFriends(user_id: string):
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
                id: user_id,
            })
        }
    
    
        fetch(`/api/database/profile/getFriends`, request)
        .then(res => res.json())
        .then(res => {
            let friends = res.friends.friends
           setFriends(friends? friends : [])
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
    }

    return [friends, loading, pullFriends]
}

/**
 * useAddFriend: Hook to add friend to user's friends list.
 * 
 * @param user_id User which friend will be added to
 * @param friend_id ID of friend to add to user's friends list
 * @returns Still nothing LOL
 */
export function useAddFriend(user_id: string, friend_id: string):
    [boolean, boolean, () => void] {

        const [success, setSuccess] = useState(false);
        const [loading, setLoading] = useState(false);

        function addFriend() {
            if(loading)
                return;

            setLoading(true);
            setSuccess(false);

            const request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user_id,
                    friend_id: friend_id
                })
            }
        
            fetch(`/api/database/profile/addFriend`, request)
            .then(res => res.json())
            .then(resj => {
                const res = resj as DatabaseResponse
                if(res.success) setSuccess(true)
                else setSuccess(false)
            })
            .catch(err => setSuccess(false))
            .finally(() => setLoading(false))
        }

    return [success, loading, addFriend];
}

/**
 * useDeleteFriend: Deletes a friend from a user's friends list.
 * 
 * @param user_id User whose friends list will be modified
 * @param friend_id Unfortunate ex friend's ID
 * @returns Your mom.
 */
export function useDeleteFriend(user_id: string, friend_id: string):
    [boolean, boolean, () => void] {

        const [success, setSuccess] = useState(false)
        const [loading, setLoading] = useState(false)
        const [friends, friendsLoading, fetchFriends] = useFriends(user_id);

        function removeFriend() {

            if(loading) {
                setSuccess(false)
                return;
            }

            setLoading(true);
            setSuccess(false);

            const request = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user_id,
                    friend_id: friend_id
                })
            }
            
            fetch(`/api/database/profile/removeFriend`, request)
            .then(res => res.json())
            .then(resj => {
                const res = resj as DatabaseResponse;
                if(!res.success) setSuccess(false)
                else setSuccess(true)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
            
        }

        return [success, loading, removeFriend];
}