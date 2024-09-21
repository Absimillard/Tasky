import { Box, Typography, useTheme, Avatar, IconButton } from "@mui/material";
import { Link } from "react-router-dom"
import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import PersonRemoveRoundedIcon from '@mui/icons-material/PersonRemoveRounded';
import { tokens } from "../../theme";
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import Header from "../../components/Header";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { useFetchUsersQuery } from '../../store/slices/api/apiSlice'
import UserProfil from "../../components/UserProfil";
import UserProjects from "../../components/UserProjects";
import { setUsers } from "../../store/slices/usersSlice";
const Users = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { data, isLoading, isError, isSuccess } = useFetchUsersQuery();
  const { currents } = useSelector((state) => state.users);
  const [usersList, setUsersList] = useState(currents);
  const [edit, setEdit] = useState(true);
  const [selectedUser, setSelectedUser] = useState();

  useEffect(() => {
    dispatch(setUsers(data?.users))
  }, [data]);

  const dispatch = useDispatch();
  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/users/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };
  // Listen for socket events
  const team = [...usersList].filter((user) => {return user?.status === 'team'});
  const client = [...usersList].filter((user) => {return user?.status === 'client'}); 
  const columns = [
    { field:"id", headerName:"",renderHeader:() => null},
    {
      field: "actions",
      headerName: "",
      flex: 0.1,
      sortable: false,
      renderHeader:() => null,
      disableColumnMenu: true,
      renderCell: (user) => {
        return (<>
          <IconButton onClick={() => setSelectedUser(user?.row)} variant="contained">
          <VisibilityRoundedIcon />
          </IconButton>
          <IconButton onClick={() => deleteUser(user?.row?._id)} variant="contained">
          <PersonRemoveRoundedIcon />
          </IconButton>
        </>);
      }
    },
    {
      field: "avatar",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
      renderHeader:() => null,
      align: "right",
      renderCell: (avatar) => {return(<Avatar src={avatar.value} />)}
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.3,
      cellClassName: "name-column--cell",
      renderCell: (user) => {return(<Box display='flex' flexDirection='column'><Typography>{user.row.name}</Typography><Typography color={colors.greenAccent[400]} sx={{ fontStyle: 'italic' }}>{user.row.affiliate}</Typography></Box>)},
    },
  ];
  
  return (
    <Box m="20px" display="flex" flexDirection="row" flexWrap="wrap">
      <Header title="TEAM" subtitle="Managing the Team Members"/>
      <Box
        flex="1"
        m="40px 0 0 0"
        height="75vh"
        display="flex"
        width="100%" 
        flexDirection="row" 
        justifyContent='center'
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer button": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      > <Box sx={{maxWidth:'35%', width:'100%'}}>
          <UserProfil user={selectedUser} edit={edit} />
        </Box>
        <Box display="flex" width="100%" justifyContent="space-around" flexDirection="row" p="0 2rem" maxWidth="70%" > 
          <DataGrid sx={{maxWidth:'45%'}} initialState={{
            ...team,
            pagination: { paginationModel: { pageSize: 10 } },
          }} pageSizeOptions={[5, 10]} columnVisibilityModel={{id: false}} disableColumnFilter disableColumnSelector disableDensitySelector rows={team} columns={columns} slots={{toolbar: GridToolbar}} slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => {return row?._id}}/>
          <DataGrid sx={{maxWidth:'45%'}} initialState={{
            ...client,
            pagination: { paginationModel: { pageSize: 10 } },
          }} pageSizeOptions={[5, 10]} columnVisibilityModel={{id: false}} disableColumnFilter disableColumnSelector disableDensitySelector rows={client} columns={columns} slots={{toolbar: GridToolbar}} slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          getRowId={(row) => {return row?._id}}/>
        </Box>
      </Box>
    </Box>
  );
};

export default Users;