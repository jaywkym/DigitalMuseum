import React, { useState, useEffect } from 'react';
import MuseForm from './uploadform';
import ComeBackLater from './alreadyPosted';
import { useSession } from 'next-auth/react'

const CheckItemExists = () => {
  const [itemExists, setItemExists] = useState(null);

  useEffect(() => {

    const { data: session, status } = useSession();
    let user_id = status === 'authenticated' ? (session.user as any).id : "";

    








    fetch('/backend/checkitemexists')
      .then((response) => response.json())
      .then((data) => {
        setItemExists(data.itemExists);
      });
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
