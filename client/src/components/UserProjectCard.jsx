import { Avatar, AvatarGroup, Box, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';

const UserProjectCard = ({ project }) => {
  const team = project.participants.length + project.guests.length;
  console.log(project.participants.length)
  return (
    <Box sx={{backgroundColor:'#1F2A40', margin:'2rem', display:'flex', flexDirection:'row'}}>
    <Grid container spacing={2} className='flex'>
      <Grid item xs={12}>
      <Typography fontWeight="fontWeightBold" variant="h4">{project.title || 'No brief available'}</Typography>
        <Typography variant="body2">Created By: {project.createdBy.name || 'No brief available'}</Typography>
        <Typography variant="body2">Created At: {project.createdAt || 'No brief available'}</Typography>
        <Typography variant="body1">Participants: {team}</Typography>
      </Grid>
    </Grid>
    </Box>);
};



export default UserProjectCard;