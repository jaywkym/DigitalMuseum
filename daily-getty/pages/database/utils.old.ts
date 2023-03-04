import { useMemo, useState } from "react";
import type { 
    DatabasePost, 
    DatabaseUserPostsResponse,
    DatabaseUserPostResponse,
    DatabaseResponse
}  from "../../types/FirebaseResponseTypes";

/**
 * useFriends: Hook to retreive all the friends of a user given an ID.
 * 
 * @param user_id ID of user to retrieve all friends    
 * @returns Nothing... Why does everyone always expect me to return something.
 */
export default function useFriends(user_id: string):
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
        
            fetch(`/api/database/addFriend`, request)
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

/**
 * useAddPost: Saves a post to the database for the user. Only a single post
 *             can be added to the database for a user per day. Every additional
 *             post will update the previous post for the day.
 * 
 * @param user_id User who is adding the post
 * @param created Timestamp from Dalle when the image was created
 * @param b64 Base64 encoded image string
 * @returns Void. Like my cold dead heart...
 */
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

/**
 * useGetAllPostsForUser: Hook to retrieve all posts given a user ID.
 * 
 * @param user_id ID of the user
 * @returns https://www.youtube.com/watch?v=dQw4w9WgXcQ
 */
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

/**
 * useGetPostForUser: Gets a specific post for a user given a user's id and 
 *                    a post ID.
 * 
 * @param user_id ID of user
 * @param post_id ID of post. Follows the format <YEAR>_<MONTH>_<DAY>
 * @returns <INSERT MONKEY EMOJI HERE>
 */
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