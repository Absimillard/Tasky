import { Box, Button, Grid, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useState } from 'react';
import * as Yup from 'yup';
import Textfield from '../../components/form_ui/TextField';
import DatePicker from '../../components/form_ui/DatePicker';


const Register = () => {
    const [file, setFile] = useState(null);
    const [user, setUser] = useState({});
    const [msg, setMsg] = useState('Upload an avatar ?');
    const [img, setImg] = useState({
        preview:'',
        raw:''
    });
    const phoneRegExp =  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const intialValues = {
        avatar: "",
        firstName: "",
        lastName:"",
        email: "",
        password:"",
        adress: "",
        city:"",
        zipcode:"",
        contact: "",
        affiliate: "",
        status:"client",
        privilege:"user",
        regDate:""
    };
    const userSchema = Yup.object().shape({
        avatar: Yup.string(),
        firstName: Yup.string().required("required"),
        lastName: Yup.string().required("required"),
        email: Yup.string().email("invalid email").required("required"),
        password: Yup.string().required("required"),
        adress: Yup.string().required("required"),
        city: Yup.string().required("required"),
        zipcode: Yup.string().required("required"),
        contact: Yup.string().matches(phoneRegExp, "Phone number is not valid !").required("required"),
        affiliate: Yup.string().required("required"),
        status: Yup.string().required("required"),
        privilege: Yup.string(),
        regDate: Yup.date().required("required"),
    });
  return (
    <Formik initialValues={{...intialValues}} validationSchema={userSchema} onSubmit={values =>{console.log(values)}}>
        <Form>
        <Box display='flex' flexDirection='row' flexWrap='wrap'>
        <Box display="flex" flexDirection="row" alignItems="center" m={4} sx={{
            "& .inputFile": {
              border: "none",
              opacity: "0",
              width:"inherit",
              height:"7rem",
              overflow: "hidden",
              position: "absolute",
            },
            "& .inputFile + label": {
                display:"flex !important",
                flexDirection:"column",
                justifyContent:"center",
                fontSize: "1.25em",
                borderRadius:"50%",
                width:"100%",
                height:"100%",
                textAlign:"center",
                fontWeight: "700",
                color: "white",
                background: img.preview ? `url('${img.preview}')` : "black",
                backgroundSize: "cover"
            },
            
            "& .inputFile:focus + label, .inputfile + label:hover ":{
                backgroundColor: "red",
            }
          }}>
        </Box>

            <Box width="60%" p={5}>
                <Typography variant='h3' mb={2}>Personal informations</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                        <Textfield name="firstName" label="First Name"/>
                    </Grid>
                    <Grid item xs={5}>
                        <Textfield name="lastName" label="Last Name" />
                    </Grid>
                        <Grid item xs={6}>
                        <Textfield name="email" label="Email" />
                    </Grid>
                    <Grid item xs={6}>
                        <Textfield name="password" label="Password" />
                    </Grid>
                </Grid>
            </Box>
            <Box p={5}>
                <Typography variant='h3' mb={2}>Contact informations</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Textfield name="adress" label="Adress" />
                    </Grid>
                    <Grid item xs={3}>
                        <Textfield name="zipcode" label="Zipcode" />
                    </Grid>
                    <Grid item xs={4}>
                        <Textfield name="city" label="City" />
                    </Grid>
                    <Grid item xs={4}>
                        <Textfield name="contact" label="Contact" />
                    </Grid>
                    <Grid item xs={5}>
                        <Textfield name="affiliate" label="Affiliate" />
                    </Grid>
                    <Grid item xs={3}>
                        <DatePicker name="regDate" />
                    </Grid>
                </Grid>
            </Box>
            <Button variant='contained' color='secondary' type='submit'>Submit</Button>
        </Box>
        </Form>
    </Formik>
  )
}

export default Register