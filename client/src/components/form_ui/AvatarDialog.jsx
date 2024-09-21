import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, Button, Typography  } from '@mui/material';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const AvatarDialog = ({ openDial, handleClose, user}) => {
  const [openDialog, setOpenDialog] = useState(openDial);
  const [file, setFile] = useState(null);
  const imgPlacehold = { 
    preview:'',
    raw:''}
  const [img, setImg] = useState(imgPlacehold);
  const [progress, setProgress] = useState({started:false, completed: 0});
  const [msg, setMsg] = useState('Upload an avatar ?');
  const userName = user?.trim();
  const handleUpload = async(e) => {
    if(!file) {
        console.log("No file selected !");
        return;
    } 
    const fd = new FormData();
    fd.append('file', file);
    await axios.post('http://localhost:3000/upload', fd, {
        headers: {
            "Custom-Header": "value",
            "Content-Type": "mutipart/form-data",
        },
    }).then(res => {
        console.log(res.data)
    }).catch(err => {
        console.error(err);
    });

}
  const handleChange = (e) => {
      setFile(e.target.files[0]);
      setImg({
          preview: URL.createObjectURL(e.target.files[0]),
          raw: e.target.files[0],
        }); 
      setMsg(userName);
      console.log(file)
  }
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFile(null);
    setImg(imgPlacehold);
    setMsg('Upload an avatar ?')
    handleClose(false);
  };
  useEffect(() => {
    setOpenDialog(openDial);
  }, [openDial]);
  useEffect(() => {
    console.log(file);
  }, [file]);
  return (
    <>
      <Dialog open={openDialog} onClose={handleCloseDialog} sx={{width:'50vw', height:'50vh', margin:'auto'}}>
            <DialogContent>
                <Box display="flex" flexDirection="row" alignItems="center" flexWrap='wrap' m={4} sx={{
                    "& .inputFile": {
                    border: "none",
                    opacity: "0",
                    width:"inherit",
                    height:"10rem",
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
                }}><Box sx={{display:'flex', flexDirection:'column', width:'100%'}}>
                    <Box borderRadius='50%' width='10rem' height='10rem' sx={{
                        verticalAlign: "middle"}}>
                        <input className='inputFile' onSubmit={handleUpload} onChange={handleChange} type='file'/>
                        <label htmlFor='file'>
                            <p>{file ? null: "Click or drop"}</p>
                        </label>
                    </Box>
                    {msg ? <Typography sx={{maxWidth:'12rem', textAlign:'center'}} mt={2} variant='h4'>{msg}</Typography> : <Typography sx={{maxWidth:'12rem', textAlign:'center'}} mt={2} variant='h4'>{msg}</Typography>}
                    </Box>
                    
                </Box>
            </DialogContent>
        <DialogActions>
          <Button color='secondary' onClick={handleCloseDialog}>Close</Button>
          <Button color='secondary' type='submit'>upload</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AvatarDialog