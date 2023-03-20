import { useState } from "react";
import type { 
    DatabaseFriendsResponse,
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

    async function pullFriends() {

        if(loading)
            return;

        setLoading(true);

        const dbFriendsResponse = await requestFriendsForUser(user_id);

        if(dbFriendsResponse.success) {
            const friends = dbFriendsResponse.friends.friends;
            setFriends(friends? friends : []);
        }

       setLoading(false);
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

        async function addFriend() {
            if(loading)
                return;

            setLoading(true);
            setSuccess(false);

            const dbResponse = await requestAddFriend(user_id, friend_id);

            setSuccess(dbResponse.success)

            setLoading(false)
            
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

        async function removeFriend() {

            if(loading) {
                setSuccess(false)
                return;
            }

            setLoading(true);
            setSuccess(false);

            const dbResponse = await requestRemoveFriend(user_id, friend_id);

            setSuccess(dbResponse.success)
            setLoading(false)
            
        }

        return [success, loading, removeFriend];
}

async function requestRemoveFriend(user_id: string, friend_id: string): Promise<DatabaseResponse> {

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
    
    try {
        const resp = await fetch(`/api/database/profile/removeFriend`, request)
        return await resp.json() as DatabaseResponse;
    } catch (err: any) {
        return {success: false} as DatabaseResponse;
    }

}

async function requestFriendsForUser(user_id: string): Promise<DatabaseFriendsResponse> {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: user_id,
        })
    }

    try {
        const resp = await fetch(`/api/database/profile/getFriends`, request)
        return await resp.json() as DatabaseFriendsResponse
    } catch (err: any) {
        return {success: false} as DatabaseFriendsResponse
    }

}

async function requestAddFriend(user_id: string, friend_id: string): Promise<DatabaseResponse> {
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

    try {
        const resp = await fetch(`/api/database/profile/addFriend`, request);
        return await resp.json() as DatabaseResponse;
    } catch (err: any) {
        return {success: false} as DatabaseResponse;
    }

}

export default function DoNothing() {
    console.log("Nothing")
}