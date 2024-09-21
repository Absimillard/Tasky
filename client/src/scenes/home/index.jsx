import React from 'react'
import { Button } from '@mui/material'
import { Link, Navigate } from 'react-router-dom'


function Home() {
  return (<>
    <div>Please login</div>
    <Button component={Link} to={'/global'} color='secondary' variant='contained'>LOGIN</Button>
    </>
  )
}

export default Home