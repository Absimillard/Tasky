import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { VideoLibrary, Description, MusicNote, Delete } from '@mui/icons-material';
import { Box } from '@mui/material';

const StyledVideoLibrary = styled(VideoLibrary)({
  marginLeft: '10px',
});

const StyledDescription = styled(Description)({
  marginLeft: '10px',
});

const StyledMusicNote = styled(MusicNote)({
  marginLeft: '10px',
});

const StyledDelete = styled(Delete)({
  marginRight: '8px',
});

const FileUploadComponent = (props) => {
  const [attached, setAttached] = useState([]);

  const handleFileUpload = (files) => {
    try {
      setAttached((prevAttached) => [...prevAttached, ...files]);
     
    } catch (error) {
      console.log(error);
    }
    
  };
  
  const handleFileRemove = (index) => {
    setAttached((prevAttached) => prevAttached.filter((_, i) => i !== index));
  };

  useEffect(() => {
    props.onAttachedChange(attached);
  }, [attached]);


  return (
    <Box sx={{
        "& .uploadItem": {
            transition: 'all .5s ease'
        },
        "& .uploadItem:hover": {
            backgroundColor: 'rgba(255, 255, 255, 0.08)'
        },}}>
      <input
        type="file"
        accept="image/*,video/*,audio/*,application/pdf,.txt"
        multiple
        className='inputFile'
        onChange={(e) => handleFileUpload(Array.from(e.target.files))}
      />
      <label htmlFor='file'>Click / Drag & drop</label>
      <div>
        {attached.map((file, index) => (
          <Box className='uploadItem' key={index} display='flex' height='4rem' flexDirection='row' mb={1} alignItems="center" borderRadius='10px' justifyContent="space-between" p={1} sx={{backgroundColor: 'rgba(255, 255, 255, 0.03)'}}>
            {file.type.startsWith('image/') ? 
            (<Box height='3rem' 
            width='3rem' 
            borderRadius='50%' 
            overflow='hidden' 
            sx={{"& img": {
                marginRight: '8px',
            },}}>
              <img height='100%' src={URL.createObjectURL(file)} alt={file.name} />
              </Box>) : (
              <>
                {file.type.startsWith('video/') && <StyledVideoLibrary />}
                {file.type === 'application/pdf' && <StyledDescription />}
                {file.type === 'text/plain' && <StyledDescription />}
                {file.type.startsWith('audio/') && <StyledMusicNote />}
              </>
            )}
            <span>{file.name}</span>
            <StyledDelete onClick={() => handleFileRemove(index)} />
          </Box>
        ))}
      </div>
    </Box>
  );
};

export default FileUploadComponent;
