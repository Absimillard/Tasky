import React from 'react'
import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@mui/material'
import { useField, useFormikContext } from 'formik'
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';


const CustomCheck = ({
    name,
    label,
    icon,
    checkedIcon,
    iconColor,
    checkedIconColor,
    iconSize,
    value,
    ...otherProps
}) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (e) => {
        const newValue = e.target.checked ? value : 'user';
        setFieldValue(name, newValue);
    };

    const configCheckbox = {
        ...field,
        onChange: handleChange,
        icon: icon ? icon : undefined,
        checkedIcon: checkedIcon ? checkedIcon : undefined,
        sx: {
            '& .MuiSvgIcon-root': {
                color: iconColor, // Color for unchecked icon
                fontSize: iconSize, // Size for unchecked icon
                transition: 'color 0.3s ease', // Transition for color change
            },
            '&.Mui-checked .MuiSvgIcon-root': {
                color: checkedIconColor, // Color for checked icon
                fontSize: iconSize, // Size for checked icon
            },
        },
    };

    const configFormControl = {};
    if (meta && meta.touched && meta.error) {
        configFormControl.error = true
    }

  return (
    <FormControl {...configFormControl}>
        <FormGroup>
            <FormControlLabel
                label={label}
                control={<Checkbox icon={icon} checkedIcon={checkedIcon} {...configCheckbox}/>}
            />
        </FormGroup>
    </FormControl>
  )
}

export default CustomCheck