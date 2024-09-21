import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Avatar, Typography, IconButton, useTheme} from "@mui/material";
import { tokens } from '../../theme';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';

const TeamGrid = ({onSubmitParticipants, onSubmitGuests}) => {
  const users = useSelector(state => state.users.currents) || [];
  const { selectedProject, currentSelected } = useSelector((state) => state.projects.selected);
  const [team, setTeam] = useState(currentSelected?.participants);
  const [usersList, setUsersList] = useState(users);
  const [teamGuests, setTeamGuests] = useState(currentSelected?.guests);
  const [guest, setGuest] = useState({ name: '', email: '', role:'guest', joinDate: null});
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const filteredUsersList = usersList?.filter(user => !team.some(t => t?._id === user?._id));

  useEffect(()=>{
    console.log(team)
  },[team]);

  const usersColumns = [
    { field:"_id", renderHeader:()=>null},
    {
      field: "affiliate",
      headerName: "Affiliate",
      flex: 0.2,
      cellClassName: "name-column--cell",
      renderCell: (user) => {return(<Box display='flex' flexDirection='column'><Typography color={colors.greenAccent[400]} sx={{ fontStyle: 'italic' }}>{user.row.affiliate}</Typography></Box>)},
    },
    {
      field: "avatar",
      renderHeader:()=>null,
      sortable: false,
      disableColumnMenu: true,
      align: "right",
      renderCell: (user) => {return(<>
        <IconButton
        onClick={(e) => addTeam(user, e)}
        variant="contained"
      >
      <AddRoundedIcon sx={{zIndex:'2',position:'absolute', top:'0.5rem', right:'-0.3rem', fontSize:'1.5rem', stroke:'green', strokeWidth:'.1rem'}}/>
      <Avatar sx={{}}src={user.row.avatar} />
      </IconButton>
      
      </>)}
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.3,
      cellClassName: "name-column--cell",
      renderCell: (user) => {return(<Box display='flex' flexDirection='column'><Typography>{user.row.name}</Typography><Typography color={colors.greenAccent[400]} sx={{ fontStyle: 'italic' }}>{user.row.occupation}</Typography></Box>)},
    },
  ];
  const teamColumns = [
    { field:"_id", 
    renderHeader:()=>null},
    {
      field: "avatar",
      headerName: "",
      flex:0.15,
      renderHeader:()=>null,
      sortable: false,
      disableColumnMenu: true,
      align: "right",
      renderCell: (user) => {return(<>
        <IconButton
        onClick={(e) => removeTeam(user, e)}
        variant="contained"
      >
      <RemoveRoundedIcon sx={{zIndex:'2',position:'absolute', top:'0.5rem', right:'-0.3rem', fontSize:'1.5rem', stroke:'red', strokeWidth:'.1rem'}}/>
      <Avatar sx={{}}src={user.row.avatar} />
      </IconButton>
      
      </>)}
    },
    {
      field: "name",
      headerName: "Name",
      flex:0.3,
      renderHeader:()=>null,
      renderCell: (user) => {return(<Box display='flex' flexDirection='column'><Typography>{user.row.name}</Typography><Typography color={colors.grey[300]} sx={{ fontStyle: 'italic' }}>{user.row.occupation}</Typography></Box>)},
      cellClassName: "name-column--cell",
    },
    { field:"role",
      headerName:"",
      flex:0.2,
      renderCell: (user) => {return(<>
        <IconButton
          onClick={(e) => roleChange(e, user)}
          variant="contained"
        > 
        {user.row.role === 'member' ? <AccountCircleOutlinedIcon /> : <FolderSharedIcon />}
        <Typography>{user.row.role}</Typography>
        </IconButton>
      </>)},
      
      },
      {
        field: "affiliate",
        headerName: "Affiliate",
        flex: 0.2,
        cellClassName: "name-column--cell",
        renderCell: (user) => {return(<Box display='flex' flexDirection='column'><Typography color={colors.greenAccent[400]} sx={{ fontStyle: 'italic' }}>{user.row.affiliate}</Typography></Box>)},
      },
  ];
  const guestColumns = [
   {
      field: "avatar",
      headerName: "",
      flex:0.3,
      renderHeader:()=>null,
      sortable: false,
      disableColumnMenu: true,
      align: "right",
      renderCell: (guest) => {return(<>
        <IconButton
        onClick={(e) => removeGuest(guest, e)}
        variant="contained"
      >
      <RemoveRoundedIcon sx={{zIndex:'2',position:'absolute', top:'0.5rem', right:'-0.3rem', fontSize:'1.5rem', stroke:'red', strokeWidth:'.1rem'}}/>
      <Avatar src='' />
      </IconButton>
      
      </>)}
    },
    {
      field: "name",
      headerName: "Name",
      flex:.5,
      renderHeader:()=>null,
      renderCell: (user) => {return(<Box display='flex' flexDirection='column'><Typography>{user.row.name}</Typography><Typography color={colors.grey[300]} sx={{ fontStyle: 'italic' }}>{user.row.email}</Typography></Box>)},
      cellClassName: "name-column--cell",
    },
  ];
  const addTeam = (user, e) => {
    e.stopPropagation();
    // Add a new member to the team state
    const newMember = {role:'member', _id: user.row._id, name:user.row.name, avatar:user.row.avatar, affiliate:user.row.affiliate, occupation:user.row.occupation, joinDate: null};
    const updatedTeam = [...team, newMember];
    // Remove the user from usersList
    const updatedUsersList = usersList.filter((u) => u._id !== user.row._id);
    setUsersList(updatedUsersList);
    setTeam(updatedTeam);
  };
  
  const addGuest = (e) => {
    e.stopPropagation();
    const updatedGuests = [...teamGuests, guest];
    setTeamGuests(updatedGuests);
    setGuest({...guest, name: '', email: ''});
  };

  const removeTeam = (user, e) => {
    e.stopPropagation();
    const updatedParticipants = team.filter((p) => p._id !== user.row._id);
    setTeam(updatedParticipants);

    // Add the user back to the usersList
    const updatedUsersList = [...usersList, user.row];
    setUsersList(updatedUsersList);
  };

  const removeGuest = (user, e) => {
    e.stopPropagation();
    const updatedGuests = teamGuests.filter((g) => g.name !== user.row.name);
    setTeamGuests(updatedGuests);
  };

  const guestNameChange = (event) => {
    const guestName = event.target.value;
    setGuest({...guest, name: guestName});
  };
  const guestMailChange = (event) => {
    const guestMail = event.target.value;
    setGuest({...guest, email: guestMail});
  };
  const roleChange = (e, params) => {
    e.stopPropagation();
    const updatedParticipants = team.map((participant) => {
      if (participant._id === params.row._id) {
        // Toggle the role between "Lead" and "Member"
        const newRole = participant.role === 'lead' ? 'member' : 'lead';
        return { ...participant, role: newRole };
      }
      return participant;
    });
    setTeam(updatedParticipants);
  };

  const handleSave = () => {
    onSubmitParticipants(team);
    onSubmitGuests(teamGuests); 
  };
  return (<>
    <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-around">
      <Box width='30%' sx={{"& .MuiDataGrid-toolbarContainer button": {color: `${colors.greenAccent[200]} !important`}}}>
        <DataGrid
          hideFooter
          columnVisibilityModel={{id: false}}
          rows={filteredUsersList}
          columns={usersColumns}
          slots={{toolbar: GridToolbar}}
          getRowId={(row) => row._id}
        />
      </Box>
      <Box width='30%' display='flex' flexDirection='column' justifyContent='start'>
        <DataGrid
          getRowClassName={(params) => `role-theme--${params.row.name}`}
          sx={{"& .role-theme--lead": {backgroundColor: colors.greenAccent[800]},"& .role-theme--member": {backgroundColor: colors.greenAccent[700]},"& .role-theme--guest": {backgroundColor: colors.greenAccent[500]}}}
          columnVisibilityModel={{_id: false}}
          rows={team}
          getRowId={(row) => row._id}
          columns={teamColumns}
          slots={{columnHeaders: () => null,footer: () => null}}
        />
      </Box>
      <Box>
        <Box height="80%" display="flex" flexDirection="column" flexWrap="wrap" justifyContent='space-between' mb="80%">
          <Typography variant="h3" width="100%">Add guest ?</Typography>
          <TextField width="50%" value={guest.name} onChange={guestNameChange} name="name" placeholder="Name"></TextField>
          <TextField width="50%" value={guest.email} onChange={guestMailChange} name="email" placeholder="Email"></TextField>
          <Button width="100%" color="primary" onClick={addGuest} sx={{backgroundColor: colors.greenAccent[300]}}>Add</Button>
          <Box display='flex' height='15rem'>
            <DataGrid
              getRowClassName={(params) => `role-theme--${params.row.name}`}
              sx={{"& .role-theme--lead": {backgroundColor: colors.greenAccent[800]},"& .role-theme--member": {backgroundColor: colors.greenAccent[700]},"& .role-theme--guest": {backgroundColor: colors.greenAccent[500]}}}
              columnVisibilityModel={{id: false}}
              rows={teamGuests}
              getRowId={(row) => row.name}
              columns={guestColumns}
              slots={{columnHeaders: () => null,footer: () => null}}
            />
          </Box>
        </Box>
      </Box>
    </Box>
    <Button onClick={handleSave}>Save</Button>
    </>)
};

export default TeamGrid;
