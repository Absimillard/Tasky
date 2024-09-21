import React, { useEffect } from 'react'
import { Navigate } from 'react-router-dom';

function Logout() {
    useEffect(() => {
    })
  return (<>
    <Navigate to="/" replace={true}/>
    </>
  )
}

export default Logout