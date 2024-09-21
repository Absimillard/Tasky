import React, { useEffect, useState } from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import Textfield from '../../components/form_ui/TextField'
import CustomRadio from '../../components/form_ui/CustomRadio'
import { Box, Typography, Grid, Button, useTheme } from '@mui/material'
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import SupervisedUserCircleOutlinedIcon from '@mui/icons-material/SupervisedUserCircleOutlined'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined'
import axios from 'axios'
import ReturnButton from '../../components/ReturnButton'
import { tokens } from '../../theme'
import { socketClient as socket } from '../../store/store.js'
import { createUser } from '../../store/slices/usersSlice.js'
import { useDispatch } from 'react-redux'

const TeamForm = ({validate}) => {
    const [img, setImg] = useState({
        preview:'',
        raw:''
    });
    const [progress, setProgress] = useState({started:false, completed: 0});
    const [msg, setMsg] = useState('Upload an avatar ?');
    const theme = useTheme();
    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);
    const teamInitials = {
        avatar: "",
        name:"",
        email: "",
        password:"",
        affiliate: "Somah corp.",
        status:"team",
        privilege:"user",
        regDate:null,
    };
    const teamSchema = Yup.object().shape({
        avatar: Yup.string(),
        name: Yup.string().required("required"),
        email: Yup.string().email("invalid email").required("required"),
        password: Yup.string().required("required"),
        affiliate: Yup.string(),
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
  <Formik initialValues={{...teamInitials}} validationSchema={teamSchema}
        >{(values) => (
    <Form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(values);
      }}>
        <Box display='flex' flexDirection='row' flexWrap='wrap' justifyContent='space-between'>
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
            <Box
    borderRadius="50%"
    width="7rem"
    height="7rem"
    mr={3}
    sx={{
      verticalAlign: "middle"
    }}
  >
    <input className="inputFile" onChange={handleChange} type="file" />
    <label htmlFor="file">
      <p>{img ? "" : "Click or drop"}</p>
    </label>
  </Box>
  {img && (
    <Typography variant="h4">
      {msg ? msg : "Upload an avatar ?"}
    </Typography>
  )}
        </Box>
        <Box width='40%'>
        
        </Box>
            <Box width="100%" p={5}>
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
                    
                    <Grid ml={3} item xs={4}>
                    <Box sx={{'& .radio-button': {
                        color:'primary',
                    },
                    '& .selected': {
                        color:'secondary',
                    },}}>
                        <CustomRadio  icon={<SupervisedUserCircleOutlinedIcon />} checkedIcon={<SupervisedUserCircleIcon />} name='privilege' label="Admin" value="admin" defaultValue='user'/>
                        <CustomRadio icon={<WorkspacePremiumOutlinedIcon />} checkedIcon={<WorkspacePremiumIcon />} name='privilege' label="Super Admin" value="supAdmin" defaultValue='user'/>
                    </Box>
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

export default TeamForm