import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Avatar, AvatarGroup, Badge, Box, Button, IconButton, SvgIcon, Typography } from '@mui/material';
import ReturnButton from '../../components/ReturnButton';
import { useSelector } from 'react-redux';
import { useFetchUserQuery } from '../../store/slices/api/apiSlice';
import { useFetchUserProjectsQuery } from '../../store/slices/api/apiSlice';
import UserProjects from '../../components/UserProjects';
import UserProfil from '../../components/UserProfil';

function User() {
  let { userId } = useParams();
  const { data, isLoading, isError, isSuccess } = useFetchUserQuery(userId);
  const { currents } = useSelector((state) => state.projects.list);
  const [userProjects, setUserProjects] = useState();
  const [edit, setEdit] = useState(true);


  useEffect(() => {
    let userCurrents = currents;
    console.log(userCurrents)
  }, [currents]);

  return (<>
    <Box sx={{margin:'2rem', height:'90vh', width:'auto', display:'flex', flexDirection:'column', flexWrap:'wrap'}}>
      
      <UserProfil user={data?.user} edit={edit} />
      <Box sx={{margin:'2rem', height:'50%', width:'30%', border:'1px solid #1F2A40', borderRadius:'15px'}}>
        <UserProjects userId={userId} />
      </Box>
      <Box sx={{margin:'2rem', height:'80%', width:'60%', border:'1px solid #1F2A40', borderRadius:'15px'}}>
      <Typography fontWeight="fontWeightBold" variant='h1'>{data?.user.contact}</Typography>
      <Typography fontWeight="fontWeightBold" variant='h2'>{data?.user.registerDate}</Typography>
      <Typography fontWeight="fontWeightBold" variant='h3'>{data?.user.email}</Typography>
      </Box>
      <ReturnButton title="Back"/>
    </Box>
  </>)
}

export default User