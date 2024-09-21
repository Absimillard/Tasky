import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Groups3Icon from '@mui/icons-material/Groups3';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate, useParams } from 'react-router-dom';
import FieldEdit from '../../components/form_ui/FieldEdit';
import moment from 'moment';
import TeamGridDialog from '../../components/form_ui/TeamGridDialog';
import { useDispatch, useSelector } from 'react-redux';
// import { fetchProjectById, updateProjectInStore, updateProjectOnServer } from '../../store/slices/projectsSlice';
import { useFetchProjectQuery } from '../../store/slices/api/apiSlice.js';
import { fetchProject } from '../../store/slices/projects/selectedSlice.js';
import { updateParticipants } from '../../store/slices/projects/participantsSlice.js';
import { updateGuests } from '../../store/slices/projects/guestsSlice.js';
import ProjectTeam from '../../components/form_ui/ProjectTeam.jsx';

const Project = () => {
  const { projectId } = useParams();
  const [submitUpdate, setSubmitUpdate] = useState(false);
  const { isLoading, isError, data, isSuccess } = useFetchProjectQuery(projectId);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { participants } = useSelector((state) => state.projects.participants);
  const { selectedProject, loading, currentSelected } = useSelector((state) => state.projects.selected);
  const [currentUser, setCurrentUser] = useState(); 

  const handleSave = (fieldName, newValue) => {
    
  };
  const handleClose = () => {
    setOpenDialog(false);
  };
  const handleBlur = (fieldName, newValue) => {
    {/*
    if (openDialog) {
      updateProjectInStore(prevProject => ({
        ...prevProject,
        [fieldName]: newValue
      }));
    }
    */}
  };
  const submitChanges = () => {
    // Dispatch action to update project
    setSubmitUpdate(true)
  };
  useEffect(() => {
    dispatch(updateParticipants(currentSelected?.participants));
    dispatch(updateGuests(currentSelected?.guests));
  
  }, [currentSelected]);

  useEffect(() => {
    if (user && participants){
    const matchingParticipant = currentSelected?.participants?.find(participant => participant?._id === user?._id);
    const role = matchingParticipant?.role;
    const status = user?.status;
    setCurrentUser({role, status})
    }
  }, [participants]);
  
  useEffect(() => {
    if(submitUpdate){
      // dispatch(updateProjectOnServer(user, socket));
    }
  }, [submitUpdate]);

  useEffect(() => {
    dispatch(fetchProject(data?.project))
  }, [data]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  if (!selectedProject) {
    return <Typography>No project found.</Typography>;
  }
  // Step 2: Create Dialog Component
  
  return (
    <Grid container spacing={20}>
      <Grid item container xs={2} sx={{backgroundColor:'black'}}>
        <Grid item xs={12}>
          <FieldEdit
            defaultValue={currentSelected?.title}
            onSave={handleSave}
            onBlur={handleBlur}
            fieldName="title"
            user={currentUser}
            lead={true}
            member={false}
            team={true}
            client={true}
            tVariant='h2'
            inputType='TextField'
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h6'>created by: {currentSelected?.createdBy}</Typography>
          <Typography variant='h6'>at: {moment(currentSelected?.createdAt).format('llll')}</Typography>
        </Grid>
      </Grid>
      <Grid item container xs={8}>
        <Grid item xs={3}>
          <CalendarMonthIcon sx={{zIndex:'2', fontSize:'3rem'}}/>
          <FieldEdit
            defaultValue={moment(currentSelected?.deadline).format('llll')}
            onSave={handleSave}
            fieldName="deadline"
            user={currentUser}
            lead={true}
            member={false}
            team={true}
            client={true}
            tVariant='h3'
            inputType='DateField'
          />
        </Grid>
        <Grid item xs={12}>
          <FieldEdit
            defaultValue={currentSelected?.brief.content}
            onSave={handleSave}
            fieldName="content"
            user={currentUser}
            lead={true}
            member={false}
            team={true}
            client={true}
            inputType='TextField'
          />
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Box onClick={() => setOpenDialog(true)}>
         <Typography variant="h3"> <Groups3Icon sx={{zIndex:'2', fontSize:'3rem'}}/> Participants</Typography>
         <ProjectTeam team={currentSelected?.participants} />
          {currentSelected?.guests &&
            currentSelected?.guests?.map((g, i) => (
              <>
                <Typography variant="h4" key={i}>
                  Guest : {g?.name}
                </Typography>
                <Typography variant="h4" key={i + '_email'}>
                  {g?.email}
                </Typography>
              </>
            ))}
        </Box>
      </Grid>
      <Grid item xs={6} sx={{backgroundColor:'black', position:'absolute', top:'15%', right:'5%', width:"50vw", height:"70vh"}}>
        <Typography variant='h2'>Submits</Typography>
        {currentSelected.submits && currentSelected.submits?.map((sub, i) => ( 
          <Grid key={i} container spacing={3}>
            <Grid item xs={12}>
              <img src={sub.submitImage} alt={`Submit ${i}`} />
            </Grid>
            <Grid item xs={12}>
              <FieldEdit
                defaultValue={sub?.content}
                onSave={handleSave}
                fieldName="submits"
                user={currentUser}
                lead={true}
                member={true}
                team={true}
                client={false}
                inputType='TextField'
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h2'>Callback</Typography>
              {sub.callback && sub.callback?.map((cb, index) => (
                <Grid key={index} container spacing={3}>
                  <Grid item xs={12}>
                    <FieldEdit
                      defaultValue={cb?.content}
                      onSave={handleSave}
                      fieldName="callbacks"
                      user={currentUser}
                      lead={true}
                      member={true}
                      team={false}
                      client={true}
                    />
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item xs={6}>
        <Button variant='contained' color='secondary' onClick={() => submitChanges()}>Save</Button>
        <Button variant='contained' color='secondary' onClick={() => navigate('/projects')}>Back</Button>
      </Grid>
      <TeamGridDialog
        onSave={handleSave}
        handleClose={handleClose}
        openDial={openDialog}
        workTeam={participants}
        projectGuests={currentSelected?.guests}
      />
    </Grid>
  );
};

export default Project;
