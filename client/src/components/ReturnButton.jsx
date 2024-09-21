import { Button } from '@mui/material';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ReturnButton = ({title}) => {
    
  const navigate = useNavigate();
  return (
    <Button variant='contained' color="secondary" onClick={()=> navigate(-1)}>{title}</Button>
  )
}

export default ReturnButton