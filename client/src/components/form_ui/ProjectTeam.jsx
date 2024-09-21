import { Typography } from '@mui/material';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

function ProjectTeam() {
    const { participants } = useSelector((state) => state.projects.participants);
    const { teamGuests } = useSelector((state) => state.projects.guests);

  return (
    <div> {participants &&
        participants.map((p, i) => (
          <Typography variant="h4" key={i}>
            {p?.name}
          </Typography>
        ))}
    </div>
  )
}

export default ProjectTeam