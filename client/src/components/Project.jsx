import { Avatar, AvatarGroup, Box, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';

const Project = ({ project }) => {
  const team = project.participants.length + project.guests.length;
  console.log(project.participants.length)
  return (
    <Box sx={{backgroundColor:'#1F2A40', margin:'2rem', display:'flex', flexDirection:'row'}}>
    <Grid container spacing={2} className='flex'>
      <Grid item xs={12}>
      <Typography fontWeight="fontWeightBold" variant="h4">{project.title || 'No brief available'}</Typography>
        <Typography variant="body2">Created By: {project.createdBy.name || 'No brief available'}</Typography>
        <Typography variant="body2">Created At: {project.createdAt || 'No brief available'}</Typography>

      </Grid>
        <Box>
        <Typography variant="body1">Participants:</Typography>
        <Box sx={{display:'flex', flexDirection:'row'}}>
        <AvatarGroup max={4} sx={{'& .MuiAvatar-root': { width: '2rem', height: '2rem', fontSize: 15 }}} total={team}>
          {project.participants?.map((participant, index) => (
              <Avatar sx={{height:'2rem', width:'2rem', margin:'0 .2rem'}} src={participant?._id?.avatar} />
          ))}
          {project.guests?.map((guest, index) => (
            <Avatar sx={{height:'2rem', width:'2rem'}}/>
          ))}
        </AvatarGroup>
        </Box>
        </Box>
      {project.deadline && (
        <Grid item xs={12}>
          <Typography variant="body1">Deadline: {project.deadline}</Typography>
        </Grid>
      )}
      {project.submits && (
        <Grid item xs={12}>
          <Typography variant="body2">Submits:</Typography>
          <ul>
          {project.submits && project.submits?.map((submit) => (
                        <div key={submit._id}>
                            <p>Submitted By: {submit._id?.name}</p>
                            <p>Update: {submit.update}</p>
                            {submit.callback && submit.callback?.map((cb) => (
                                <div key={cb._id}>
                                    <p>Callback By: {cb._id?.name}</p>
                                    <p>Callback: {cb.callback}</p>
                                    <p>Callback Date: {cb.majDate}</p>
                                </div>
                            ))}
                        </div>
                    ))}
          </ul>
        </Grid>
      )}
    </Grid>
    </Box>);
};



export default Project;