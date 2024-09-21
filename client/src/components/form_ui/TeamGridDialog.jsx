import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import TeamGrid from './TeamGrid';
import { updateParticipants } from '../../store/slices/projects/participantsSlice';
import { useDispatch } from 'react-redux';
import { updateGuests } from '../../store/slices/projects/guestsSlice';

const TeamGridDialog = ({ openDial, handleClose}) => {
  const [openDialog, setOpenDialog] = useState(openDial);
  const dispatch = useDispatch();

  const handleCloseDialog = () => {
    setOpenDialog(false);
    handleClose(false);
  };
  const handleSaveDialog = (dataTeam, dataGuests) => {
    console.log(dataTeam);
    dispatch(updateParticipants(dataTeam));
    setOpenDialog(false);
    handleClose(false);
  };
  useEffect(() => {
    setOpenDialog(openDialog);
  }, [openDialog]);

  useEffect(() => {
    setOpenDialog(openDial);
  }, [openDial]);

  return (
    <>
      <Dialog open={openDialog} onClose={handleCloseDialog} fullScreen>
        <DialogTitle>Team Grid Dialog</DialogTitle>
        <DialogContent>
          <TeamGrid onSave={handleSaveDialog} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TeamGridDialog