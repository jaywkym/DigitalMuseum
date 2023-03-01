import { useState } from "react";
import type { 
    DatabasePost, DatabaseUserPostsResponse
}  from "../../types/FirebaseResponseTypes";


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
                setSuccess(true)
            })
            .catch(err => {
                setLoading(false)
                setSuccess(false)
            })
        }

    return [success, loading, addFriend];
}

export function useAddPost(user_id: string, created: number, b64: string):
    [boolean, boolean, () => void] {

        const [success, setSuccess] = useState(false)
        const [loading, setLoading] = useState(false)

        function addPost() {

            if(loading) {
                setSuccess(false)
                return;
            }

            if(user_id === undefined ||
                created === undefined ||
                b64 === undefined) {

                setSuccess(false)
                return;
            
            }

            setLoading(true)
                
            const request = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: user_id,
                    image: {
                        created: created,
                        image: b64
                    }
                })
            }
        
            console.log(request)
        
            fetch('/api/database/createPost', request)
            .then(res => res.json())
            .then(res => {
                
                console.log(res)
            })
            .catch(err => console.log(err))
            .finally(() => setLoading(false))
            
        }

        return [success, loading, addPost];
}

export function useGetAllPostsForUser(user_id: string):
    [DatabasePost[], boolean, boolean, () => void] {

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState({} as DatabasePost[])
    
    function getAllPosts() {

        if(loading) {
            setSuccess(false);
            return;
        }

        if(user_id === undefined ||
           user_id === '') {

            setSuccess(false);
            return;
        }

        setLoading(true);
        
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
            })
        }
    
        fetch('http://localhost:3000/api/database/getAllPostsFromUser', request)
        .then(res => res.json())
        .then(resj => {

            const res = resj as DatabaseUserPostsResponse

            if(!res.success) {
                setSuccess(false)
                return;
            }

            setPosts(res.posts)
            setSuccess(true)
           
        })
        .catch(err => setSuccess(false))
        .finally(() => setLoading(false))
    }

    return [posts, success, loading, getAllPosts];
}