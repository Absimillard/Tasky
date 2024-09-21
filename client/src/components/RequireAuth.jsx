import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import your checkAuth action creator
import Login from '../scenes/login';
import { Box, CircularProgress } from '@mui/material'; // Import CircularProgress for loading indicator
import { useCheckAuthQuery } from '../store/slices/api/apiSlice';
import { setCredentials } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

function RequireAuth(props) {
  const { data, isLoading, isError, isSuccess } = useCheckAuthQuery();
  const { user: authUser, token: authToken } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); 
  const navigate = useNavigate(); 

  useEffect(() => {
    if (isSuccess) {
      const user = data.user;
      const accessToken = data.accessToken;
      dispatch(setCredentials({ user, accessToken }));
    }
  }, [isSuccess, data, dispatch]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress /> {/* Display a loading indicator */}
      </Box>
    );
  }

  if (isError) {
    return <Login />;
  }
  
  return (
    <>
      <Box>{props.children}</Box>
    </>
  );
}

export default RequireAuth;
