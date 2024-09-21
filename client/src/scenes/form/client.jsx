import React, { useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import Textfield from '../../components/form_ui/TextField'
import CustomCheck from '../../components/form_ui/Checkboxes'
import { Box, Typography, Grid, Button, useTheme } from '@mui/material'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined'
import axios from 'axios'
import ReturnButton from '../../components/ReturnButton'
import { tokens } from '../../theme'
import { createUser } from '../../store/slices/usersSlice.js'
import { useDispatch } from 'react-redux'
import { socketClient as socket } from '../../store/store.js'

const ClientForm = ({validate}) => {
    const [file, setFile] = useState({});
    const [img, setImg] = useState({
        preview:'',
        raw:''
    });
    const [progress, setProgress] = useState({started:false, completed: 0});
    const [msg, setMsg] = useState('Upload an avatar ?');
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);
    const phoneRegExp =  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    const clientInitials = {
        avatar: "",
        firstName:"",
        lastName:"",
        occupation:"",
        email: "",
        password:"",
        address: "",
        city:"",
        zipcode:"",
        contact: "",
        affiliate: "",
        status:"client",
        privilege:"user",
        regDate:null,
    };
    const clientSchema = Yup.object().shape({
        avatar: Yup.string(),
        name: Yup.string().required("required"),
        email: Yup.string().email("invalid email").required("required"),
        password: Yup.string().required("required"),
        address: Yup.string().required("required"),
        city: Yup.string().required("required"),
        zipcode: Yup.string().required("required"),
        contact: Yup.string().matches(phoneRegExp, "Phone number is not valid !").required("required"),
        affiliate: Yup.string().required("required"),
        status: Yup.string(),
        privilege: Yup.string(),
    });
    const handleSubmit = async(formikValues) => {
        try {
            const values = formikValues.values;
            const newUser = {
                ...values,
                name: `${values.firstName} ${values.lastName}`,
                avatar: `http://localhost:5173/assets/users/${values.firstName}${values.lastName}/${img.raw.name}`, // Assuming the response from the image upload contains the path to the uploaded image
              };
            
          delete newUser.firstName;
          delete newUser.lastName;
          // Use the new user data to create the user
          dispatch(createUser(newUser, socket));
          // Create the new user with the path to the uploaded image as the value for the avatar field
          const uploadData = new FormData();
          uploadData.append('image', img.raw);
          // Upload the image
          const uploadResponse = await axios.post('/upload', uploadData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-path': `users/${values.firstName}${values.lastName}`,
                },
          });
          validate();
        } catch (error) {
          console.error('Error creating user:', error);
        }
      };
    const handleChange = (e) => {
        setImg({
            preview: URL.createObjectURL(e.target.files[0]),
            raw: e.target.files[0],
        }); 
        setMsg(e.target.files[0].name);
    }
  return (<>
  <Box>
  <Formik initialValues={{...clientInitials}} validationSchema={clientSchema}
        >
            {(values) => (
    <Form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(values);
      }}>
        <Box display='flex' flexDirection='row' flexWrap='wrap'>
        <Box display="flex" height='fit-content' flexDirection="column" alignItems="center" m={4} sx={{
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
            <Box borderRadius='50%' width='7rem' height='7rem' mb={3} sx={{
                verticalAlign: "middle"}}>
                <input className='inputFile' onChange={handleChange} type='file'/>
                <label htmlFor='file'>
                    <p>{img ? null: "Click or drop"}</p>
                </label>
            </Box>
            {msg ? <Typography variant='h4'>{msg}</Typography> : <Typography variant='h4'>{msg}</Typography>}
        </Box>
            <Box width="60%" p={2}>
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
                    <Grid item xs={6}>
                        <Textfield name="occupation" label="Occupation" />
                    </Grid>
                    <Grid item ml={10} xs={4}>
                        <CustomCheck 
                            name="privilege" 
                            label="is Admin ?"
                            value='admin' 
                            icon={<SupervisedUserCircleOutlinedIcon />} 
                            checkedIcon={<SupervisedUserCircleIcon />} 
                            iconColor={colors.primary[300]} 
                            checkedIconColor={colors.greenAccent[600]} 
                            iconSize={50} // Specify the size of the icons
                        />
                    </Grid>
                </Grid>
            </Box>
            <Box width='100%' p={5}>
                <Typography variant='h3' mb={2}>Contact informations</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Textfield name="address" label="Address" />
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
                </Grid>
                
            </Box>
            <Box display='flex' width='30%' flexDirection='row' justifyContent='space-around'>
                <ReturnButton title='Return'/>
                <Button variant='contained' color='secondary' type='submit'>Submit</Button>
            </Box>
        </Box>
    </Form>)}
  </Formik>
    </Box></>)
}

export default ClientForm