import React, { useState, useEffect } from 'react';
import MuseForm from './uploadform';
import ComeBackLater from './alreadyPosted';
import { useSession } from 'next-auth/react'
import { PostExistence } from '@/types/FirebaseResponseTypes';



const CheckItemExists = () => {
  const [itemExists, setItemExists] = useState(true);

  const { data: session, status } = useSession()
  let user_id = status === 'authenticated' ? (session.user as any).id : "";
 

  useEffect(() => {

    if(user_id == "")
      return;

    async function checkPostExists() {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
    
        const post_id = year + "_" + month + "_" + day;
    
        const uploadInfo = {
            post_id: post_id,
            user_id: user_id
        }
    
        const request = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(uploadInfo)
        }
    
        try {
          const dbResponse = await fetch('/api/database/posts/checkPostExist', request)
          const json = await dbResponse.json() as PostExistence;
          if(json.success)
            setItemExists(json.exist);
          else
            setItemExists(false);
        } catch (err: any) {
          console.error(err);
          setItemExists(false);
        }
      }

      checkPostExists()
      .catch(console.error)
    
      }, [user_id]);
    
      if (itemExists === null) {
        return <div>Loading...</div>;
      }
    
      if (itemExists) {
        return <ComeBackLater />;
      } else {
        return <MuseForm />;
      }
  };

export default CheckItemExists;
