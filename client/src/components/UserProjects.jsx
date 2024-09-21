import React, { useEffect } from 'react'
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import UserProjectCard from './UserProjectCard';

function UserProjects(projects) {
    const { user } = useSelector((state) => state.auth);

  return (<>
  {projects ? (
     <Box>
        <div>
            {projects?.map((project, index) => {
            const isParticipant = project.participants.some(participant => participant?._id._id === user._id);
            return (
                <div key={index}>
                {isParticipant ? (
                    <Link style={{ textDecoration: 'inherit', color:'inherit'}} to={`/projects/${project?._id}`}>
                    <UserProjectCard project={project} />
                    </Link>
                ) : (
                    <UserProjectCard project={project} />
                )}
                </div>
            );
            })}
        </div>
  </Box>) : (
                    
                    <div>No projects yet !</div>    )}
  </>)
}

export default UserProjects