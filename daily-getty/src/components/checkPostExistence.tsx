import React, { useState, useEffect } from 'react';
import MuseForm from './uploadform';
import ComeBackLater from './alreadyPosted';
import { useSession } from 'next-auth/react'



const CheckItemExists = () => {
  const [itemExists, setItemExists] = useState(null);
  const [userIDs, setUserIDs] = useState("");

  const { data: session, status } = useSession()
 

  useEffect(() => {

    let user_id = status === 'authenticated' ? (session.user as any).id : "";


   // console.log(session);

   

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const post_id = year + "_" + month + "_" + day;

    //console.log(post
    

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

    fetch('/api/database/posts/checkPostExist', request)
        .then(res => res.json())
        .then(resj => {
            console.log(resj.exist);

            console.log("THE VALUE OF THE EXISTENCE IS:" + resj.exist)
            if(resj.exist){
                setItemExists(true);
            }
            else{
                setItemExists(false);
            }


        })

  }, []);

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
