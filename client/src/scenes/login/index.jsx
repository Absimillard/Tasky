import { Box, Button, TextField, Typography, useMediaQuery } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import  { setCredentials, loginFailure } from '../../store/slices/authSlice';
import EditCalendarTwoToneIcon from '@mui/icons-material/EditCalendarTwoTone';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../store/slices/api/apiSlice';



function Login() {
    const isNonMobile = useMediaQuery("min-width:600px");
    const [triggerMutation, { isLoading, isError, data, isSuccess }] = useLoginMutation();
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, token } = useSelector((state) => state.auth)

    const handleSubmit = async (values) => {
        try {
            const response = await triggerMutation(values).unwrap();
            // Assuming response contains the user data
            dispatch(setCredentials({ user: response.user, accessToken: response.accessToken })); 
            setEmail('')
            setPass('')
            navigate('/')
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Email or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
        }
    };
    useEffect(() => {
        console.log(user)
        console.log(token)
    }, [user,token]);

    useEffect(() => {
        setErrMsg('')
    }, [email, pass]);
    
    useEffect(() => {
        console.log(data)
    }, [isSuccess]);
    return (
        <>
            <Box display="flex" height="100%">
                <Box width="50%" height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="end">
                    <Box width="50%" height="50%" display="flex" flexDirection="column" justifyContent="center" alignItems="center" borderRight="solid 2px">
                        <EditCalendarTwoToneIcon sx={{ fontSize: "10rem" }} />
                        <Typography variant='h1' width="fit-content">TASK MANAGER</Typography>
                    </Box>
                </Box>
                <Box height="100%" width="auto" flex="1" display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ "& form": { width: "fit-content" } }}>
                    <Typography variant='h1' mb="1rem">Please login :</Typography>
                    <Formik onSubmit={handleSubmit} initialValues={{ email: '', password: '' }}>
    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
            <Box display="grid" gap={2} gridTemplateColumns="repeat(2, minmax(0,1fr))"
                sx={{ "& > div": { gridColumn: isNonMobile ? "span 1" : "span 1" } }}>
                <TextField
                    variant="filled"
                    type="text"
                    label="Email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    name="email"
                    error={!!touched.email && !!errors.email}
                    helperText={touched.email && errors.email}
                    sx={{ gridColumn: "span 1" }}
                />
                <TextField
                    variant="filled"
                    type="password"
                    label="Password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    name="password"
                    error={!!touched.password && !!errors.password}
                    helperText={touched.password && errors.password}
                    sx={{ gridColumn: "span 1" }}
                />
            </Box>
            <Box display="flex" justifyContent="start" gap={2} mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                    LogIn
                </Button>
            </Box>
        </Form>
    )}
</Formik>
                </Box>
            </Box>
        </>
    )
}

export default Login;
