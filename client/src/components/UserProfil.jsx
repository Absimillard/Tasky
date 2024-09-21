import React, { useState } from 'react'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AvatarDialog from './form_ui/AvatarDialog';
import AdminIcon from "../assets/icons/admin.svg";
import { Avatar, Badge, Box, IconButton, Typography } from '@mui/material'
import { useFetchUserProjectsQuery } from '../store/slices/api/apiSlice';
import UserProjects from './UserProjects';

function UserProfil({user, edit, open}) {
    const [openDialog, setOpenDialog] = useState(false);
    const openDial = () => {
      setOpenDialog(true);
    }
    const handleClose = () => {
      setOpenDialog(false);
    }
    console.log(user);
  return (<>
    { edit ? (
      <Box sx={{display:'flex', flexDirection:'row', border:'1px solid #1F2A40', width:'100%', padding:'1rem', borderRadius:'15px'}}>
        <IconButton onClick={openDial} sx={{padding:'0'}}>
          <Badge 
            badgeContent={''}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            color="secondary">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
                user?.privilege === 'admin' ? <AdminIcon sx={{ width: '2rem', height: '2rem', color: '#6870fa' }}/> : ''
              }
            ><Box sx={{ display:'flex', justifyContent:'center', width: '9rem', height: '9rem', backgroundColor:'rgba(0,0,0, .5)', position:'absolute', borderRadius:'50%', zIndex:'2', opacity:'0', transition:'all .3s ease-out', '&:hover': {opacity: '1'},}}><AddPhotoAlternateIcon sx={{ width:'3rem', height:'3rem', alignSelf:'center' }}/></Box>
            <Avatar sx={{ width: '10rem', height: '10rem' }} alt={user?.name} src={user?.avatar}></Avatar>
            </Badge>
          </Badge>
          </IconButton>
       <Box sx={{display:'flex', flexDirection:'column', marginLeft:'2rem', width:'100%'}}>
        <Typography fontWeight="fontWeightBold" variant='h2'>{user?.name}</Typography>
        <Typography fontWeight="fontWeight" sx={{opacity:'.8'}} color='#868dfb' variant='h4'>{user?.occupation}</Typography>
        <Typography variant='h5' color='#868dfb' sx={{opacity:'.5'}}>{user?.affiliate}</Typography>
       </Box>
      </Box>
      ):(
      <Box sx={{display:'flex', flexDirection:'row', border:'1px solid #1F2A40', width:'100%', padding:'1rem', borderRadius:'15px'}}>
       <Badge 
          badgeContent={''}
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          color="secondary">
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              badgeContent={
              user?.privilege === 'admin' ? <AdminIcon sx={{ width: '2rem', height: '2rem', color: '#6870fa' }}/> : ''}
            >
              <Avatar sx={{ width: '10rem', height: '10rem' }} alt={user?.name} src={user?.avatar}></Avatar>
            </Badge>
          </Badge>
       <Box sx={{display:'flex', flexDirection:'column', marginLeft:'2rem'}}>
       <Typography fontWeight="fontWeightBold" variant='h1'>{user?.name}</Typography>
       <Typography fontWeight="fontWeight" sx={{opacity:'.8'}} color='#868dfb' variant='h4'>{user?.occupation}</Typography>
       <Typography variant='h5' color='#868dfb' sx={{opacity:'.5'}}>{user?.affiliate}</Typography>
        </Box>
        </Box>
    )
    }
   
  </>)
}

export default UserProfil

 /* <UserProjects projects={user?.ongoing} /> */