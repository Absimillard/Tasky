import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';

const FileInput = (e) => {

    const [file, setFile] = useState(null);
    const [img, setImg] = useState({
        preview:'',
        raw:''
    });
    const [progress, setProgress] = useState({started:false, completed: 0});
    const [msg, setMsg] = useState('Upload an avatar ?');
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
        setMsg(e.target.files[0].name);
        console.log(e.target.files[0])
    }
  return (
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
        <Box borderRadius='50%' width='7rem' height='7rem' mr={3} sx={{
            verticalAlign: "middle"}}>
            <input className='inputFile' onSubmit={handleUpload} onChange={handleChange} type='file'/>
            <label htmlFor='file'>
                <p>{file ? null: "Click or drop"}</p>
            </label>
        </Box>
        <Button type='submit'>upload</Button>
        {msg ? <Typography variant='h4'>{msg}</Typography> : <Typography variant='h4'>{msg}</Typography>}
    </Box>
  )
}

export default FileInput