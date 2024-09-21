import React, { useEffect, useState } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Textfield from '../../components/form_ui/TextField';
import FilesInput from '../../components/form_ui/FilesInput';
import DatePicker from '../../components/form_ui/DatePicker';
import { Box, Typography, Grid, Button } from '@mui/material';

const StepOne = ({ onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState('Upload an avatar ?');
  const projectInitials = {
    title: '',
    deadline: '',
    brief: '',
  };

  const projectSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    deadline: Yup.date().required('Deadline is required'),
    brief: Yup.object().shape({
      content: Yup.string().required('Content is required'),
      attached: Yup.array().of(
        Yup.object().shape({
          filePath: Yup.string(),
          fileName: Yup.string(),
        })
      ),
    }),
  });
  const handleAttachedChange = (attached) => {
    setFiles(attached);
  };
  useEffect(() => {
    console.log(files)
  }, [files]);

  return (
    <>
      <Formik
  initialValues={{ ...projectInitials }}
  validationSchema={projectSchema} 
>
  {({ errors, touched, setFieldValue, values }) => (
    <Form onSubmit={(e) => {
      e.preventDefault();
      console.log(values);
      onSubmit(e, { ...values, files});
    }}>
      {/* Pass the onSubmit function from Formik to the Form component */}
      <Box display="flex" flexDirection="column" flexWrap="wrap">
        {/* Pass the onSubmit function from Formik to the StepOne component */}
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          width="100%"
          justifyContent="space-around"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            m={4}
            width="20%"
          >
            {msg ? (
              <Typography variant="h4">{msg}</Typography>
            ) : (
              <Typography variant="h4">{msg}</Typography>
            )}
            <Box
              borderRadius="50%"
              minWidth="100%"
              height="100%"
              mr={3}
              mt={2}
              sx={{
                '& .inputFile': {
                  border: 'none',
                  opacity: '0',
                  width: 'inherit',
                  height: '8rem',
                  overflow: 'hidden',
                  position: 'absolute',
                },
                '& .inputFile + label': {
                  display: 'flex !important',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  fontSize: '1.25em',
                  borderRadius: '30px',
                  backgroundColor: 'rgba(255,255,255, 0.1)',
                  width: '100%',
                  height: '8rem',
                  textAlign: 'center',
                  fontWeight: '700',
                  color: 'white',
                },

                '& .inputFile:focus + label, .inputfile + label:hover ': {
                  backgroundColor: 'red',
                },
              }}
            >
              <FilesInput
                name="file"
                label="File"
                onAttachedChange={handleAttachedChange}
              />
            </Box>
          </Box>
          <Box width="60%" p={5} display="flex" flexDirection="column">
            <Typography variant="h3" mb={2}>
              Personal informations
            </Typography>
            <Grid
              container
              direction="column"
              justifyContent="start"
              wrap="nowrap"
              alignItems="start"
              spacing={2}
              width="100%"
            >
              <Grid item xs={12} width="40%">
                <Textfield name="title" fullWidth label="Title" onChange={(e) => {
                          setFieldValue('title', e.target.value);
                        }}/>
                {errors.title && touched.title ? (
                  <div>{errors.title}</div>
                ) : null}
              </Grid>
              <Grid item xs={5}>
                <DatePicker name="deadline" />
                {errors.deadline && touched.deadline ? (
                  <div>{errors.deadline}</div>
                ) : null}
              </Grid>
              <Grid item xs width="100%">
                <Textfield
                  rows={15}
                  multiline={true}
                  name="brief[0].content"
                  label="Brief"
                  onChange={(e) => {
                          setFieldValue('brief[0].content', e.target.value);
                        }}
                />
                {errors.brief && touched.brief ? (
                  <div>
                    {errors.brief.attached && <div>{errors.brief.attached}</div>}
                    {errors.brief.content && <div>{errors.brief.content}</div>}
                  </div>
                ) : null}
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Call the onSubmit prop of the Form component with the values object */}
        <Button variant="contained" color="secondary" type="submit">
          Submit
        </Button>
      </Box>
    </Form>
  )}
</Formik>
    </>
  );
};

export default StepOne;