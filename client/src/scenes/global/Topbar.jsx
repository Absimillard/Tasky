import { Box, IconButton, useTheme } from "@mui/material"
import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux' // Import useDispatch and useSelector
import { logout } from '../../store/slices/authSlice'
import { ColorModeContext, tokens } from "../../theme.js" 
import InputBase from "@mui/material/InputBase"
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined"
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined"
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined"
import SearchIcon from "@mui/icons-material/Search"
import NotificationMenu from "../../components/notifications/NotificationMenu.jsx"
import { useFetchNotificationsQuery } from "../../store/slices/api/apiSlice.js"
import { fetchNotifications } from "../../store/slices/notifsSlice.js"

const Topbar = () => {
    const theme = useTheme();
    const { user } = useSelector((state) => state.auth);
    const { isLoading, isError, data, isSuccess } = useFetchNotificationsQuery(user?._id);
    const colors = tokens(theme.palette.mode);
    const dispatch = useDispatch();
    const colorMode = useContext(ColorModeContext);// Get user from Redux
    useEffect(() => {
      console.log('Waiting for userId');
  }, [isError]);
    useEffect(() => {
      dispatch(fetchNotifications(data));
      console.log('notifications success');
  }, [isSuccess]);
 // Add dispatch and user to dependencies array

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === 'dark' ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
       <NotificationMenu></NotificationMenu>
        <IconButton component={Link} to={`/users/${user?._id}`}>
          <PersonOutlinedIcon />
        </IconButton>
        <IconButton component={Link} to={'/logout'} onClick={() => dispatch(logout())}>
          <SettingsOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
export default Topbar;