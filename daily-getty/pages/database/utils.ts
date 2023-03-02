import { useEffect, useMemo, useState } from "react";
import type { 
    DatabasePost, 
    DatabaseUserPostsResponse,
    DatabaseUserPostResponse,
    DatabaseResponse
}  from "../../types/FirebaseResponseTypes";
import { setServers } from "dns";


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
    
    
        fetch(`/api/database/getFriends`, request)
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

export function useAddFriend(id: string, friend_id: string):
    [boolean, boolean, () => void] {

        const [success, setSuccess] = useState(false);
        const [loading, setLoading] = useState(false);
        //const [friends, friendsLoading, getFriends] = useFriends(id)


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
                    id: id,
                    friend_id: friend_id
                })
            }
        
            fetch(`/api/database/addFriend`, request)
            .then(res => res.json())
            .then(res => setSuccess(true))
            .catch(err => setSuccess(false))
            .finally(() => setLoading(false))
        }

    return [success, loading, addFriend];
}

export function useDeleteFriend(user_id: string, friend_id: string):
    [boolean, boolean, () => void] {

        const [success, setSuccess] = useState(false)
        const [loading, setLoading] = useState(false)
        const [friends, friendsLoading, fetchFriends] = useFriends(user_id);

        useMemo(() => {
            fetchFriends()
        }, [user_id, friend_id]);
        
        function removeFriend() {

            if(loading) {
                setSuccess(false)
                return;
            }

            if(!friends.includes(friend_id)) {
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
            
        
            fetch(`/api/database/removeFriend`, request)
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
            setSuccess(false)
                
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
        
            fetch(`/api/database/createPost`, request)
            .then(res => res.json())
            .then(resj => {
                const res = resj as DatabaseResponse;
                if(!res.success) setSuccess(false)
                else setSuccess(true)
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
        setSuccess(false);
        
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: user_id,
            })
        }
    
        fetch(`/api/database/getAllPostsFromUser`, request)
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

export function useGetPostForUser(user_id: string, post_id: string):
    [DatabasePost, boolean, boolean, () => void] {

    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [post, setPost] = useState({} as DatabasePost)
    
    function getPost() {

        if(loading) {
            setSuccess(false);
            return;
        }

        if(user_id === undefined ||
           post_id === undefined ||
           user_id === '' ||
           post_id === '') {

            setSuccess(false);
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
                user_id: user_id,
                post_id: post_id,
            })
        }
    
        fetch(`/api/database/getPostFromUser`, request)
        .then(res => res.json())
        .then(resj => {

            const res = resj as DatabaseUserPostResponse

            if(!res.success) {
                setSuccess(false)
                return;
            }

            setPost(res.post)
            setSuccess(true)
           
        })
        .catch(err => setSuccess(false))
        .finally(() => setLoading(false))

    }

    return [post, success, loading, getPost];
}