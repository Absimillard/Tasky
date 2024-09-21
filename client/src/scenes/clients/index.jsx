import { Box, Typography, useTheme, Avatar, IconButton } from "@mui/material";
import { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from "axios";
import userStore from "../../store/userStore";

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const userAccess = "admin";
  const [users, setUsers] = useState([]);

  const clients = [...users].filter((user) => {return user.status === 'client'}); 
  const columns = [
    { field:"id", headerName:"", renderHeader:() => null},
    {
      field: "actions",
      headerName: "",
      flex: 0.1,
      renderCell: (params) => {
        return (<>
          <IconButton
            onClick={(e) => handleAddLead(e, params)}
            variant="contained"
          >
          <FolderSharedIcon />
          </IconButton>
          <IconButton
          onClick={(e) => handleAddMember(e, params)}
          variant="contained"
        >
         <GroupAddIcon />
        </IconButton>
        </>
        );
      }
    },
    {
      field: "avatar",
      headerName: "",
      sortable: false,
      disableColumnMenu: true,
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
    <Box m="20px">
      <Header title="CLIENTS" subtitle="Managing your clients" />
      <Box
        m="40px 0 0 0"
        height="75vh"
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
      ><Box display="flex" width="100%" justifyContent="center" flexDirection="row" p="0 5%"><DataGrid columnVisibilityModel={{id: false}} rows={clients} columns={columns} slots={{toolbar: GridToolbar}}/>
      </Box>
      </Box>
    </Box>
  );
};

export default Clients;