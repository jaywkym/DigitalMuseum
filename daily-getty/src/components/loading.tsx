import React from 'react'
import Skeleton from '@mui/material/Skeleton';

const Loading = ({ children }) => {
  return (
      <>
        <Skeleton width={500} height={500}>{children}</Skeleton>
    </>
  )
}

export default Loading;