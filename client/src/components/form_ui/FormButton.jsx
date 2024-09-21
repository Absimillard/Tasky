import React from 'react'
import { Button } from '@mui/material'
import { useFormikContext } from 'formik'
import axios from 'axios'

const FormButton = ({
    children,
    file,
    ...otherProps
}) => {
    const { submitForm } = useFormikContext();
    const handleUpload = () => {
        if(!file) {
            console.log("No file selected !");
            return;
        } 
        const fd = new FormData();
        fd.append('file', file);
        axios.post('/upload', fd, {
            headers: {
                "Custom-Header": "value",
                "Content-Type": "multipart/form-data"
            },
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.error(err);
        });

    }
    const handleSubmit = () => {
        handleUpload();
        submitForm();
    }
    const configButton = {
        variant: 'contained',
        color: 'primary',
        fullWidth: true,
        onClick: handleSubmit
    }
  return (
    <Button {...configButton}>{children}</Button> )
}

export default FormButton