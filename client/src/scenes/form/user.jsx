import { Box, Button, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useState, useEffect, useRef } from "react";
import Header from "../../components/Header";
import TeamForm from "./team";
import ClientForm from "./client";
import ValidForm from "../../components/form_ui/ValidForm";
import { useNavigate } from 'react-router-dom';

const UserForm = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [status, setStatus] = useState(null);
    const navigate = useNavigate();
    const headerTitle = status === null ? 'member' : status;
    const validate = () => {
      setStatus('validated');
      // navigate('/users');
    };

    return (
          <Box display="flex" flexDirection="column" height="100%" m="20px" sx={{"& form":{height:"100%"}}}>
            <Header title={`NEW ${headerTitle.toUpperCase()}`} subtitle={`Create a new ${headerTitle}`}/>
              <Box display="flex" flexDirection="row" height="100%">
                <Box width="20%" display="flex" alignItems="center" flexDirection="column" justifyContent="space-evenly"
                    sx={{"& label":{backgroundColor: `${colors.blueAccent[700]} !important`,display:"flex",width:"50% ", height:"30%", borderRadius:"15px", flexDirection:"column", justifyContent:"center", alignItems:'center', transition:'all .3s ease'},
                          }}>
                  <Button color="secondary" variant="contained" onClick={(e) => {setStatus('team')}}>Work for us ?</Button>
                  <Button color="secondary" variant="contained" onClick={(e) => {setStatus('client')}}>Work with us ?</Button>
                </Box>
                <Box width="80%">
                {status === 'team' ? <TeamForm validate={validate}/> : status === 'client' ? <ClientForm validate={validate}/> : status === 'validated' ? <ValidForm /> : null}
                </Box>
              </Box>
            
          </Box>)
          }


export default UserForm 

