import React, { useEffect, useState } from 'react';
import { Box, Button } from "@mui/material";
import { Formik, Form } from 'formik';
import axios from 'axios';
import TeamGrid from '../../components/form_ui/TeamGrid';
import { useFetchUsersQuery } from '../../store/slices/api/apiSlice';

const StepTwo = ({ onBack, onSubmitForm }) => {
    const { isLoading, isError, data, isSuccess } = useFetchUsersQuery();
    const [users, setUsers] = useState(); 
    const [participants, setParticipants] = useState([]);
    const [guests, setGuests] = useState([]);
    const initialValues = {
        participants: [],
        guests: [],
    };
useEffect(()=>{
  setUsers(data?.users);
},[data]);

useEffect(()=>{
  console.log(participants)
},[participants]);

  const handleSubmit = (values) => {
    onSubmitForm({ ...values, participants, guests });
  };
  return (
    <>
       <Formik initialValues={initialValues}>
        {(values) => 
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e, values);
              ;
            }}>{users?.length > 0 && (
              <TeamGrid
                users={users}
                workTeam={participants}
                projectGuests={guests}
                onSubmitParticipants={setParticipants}
                onSubmitGuests={setGuests}
              />
            )} 
    <Box display="flex" height="10%" justifyContent="start" gap={2} mt="20px">
              <Button color='secondary' onClick={onBack}>Back to Step One</Button>
              <Button color='secondary' type='submit'>Submit</Button>
          </Box>
            </Form>
          }</Formik>
           
      
    </>
  );
};

export default StepTwo;