import React from 'react';
import { Radio, FormControl, FormControlLabel, FormGroup } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const CustomRadio = ({
    name,
    label,
    value,
    icon,
    checkedIcon,
    ...otherProps
}) => {
    const { setFieldValue } = useFormikContext();
    const [field, meta] = useField(name);

    const handleChange = (e) => {
        const { value } = e.target;
        setFieldValue(name, value);
    };

    const configRadio = {
        ...field,
        ...otherProps,
        onChange: handleChange,
        value,
    };

    const configFormControl = {};
    if (meta && meta.touched && meta.error) {
        configFormControl.error = true;
    }

    return (
        <FormControl {...configFormControl}>
            <FormGroup>
                <FormControlLabel
                    label={label}
                    control={<Radio icon={icon} checkedIcon={checkedIcon} {...configRadio} />}
                />
            </FormGroup>
        </FormControl>
    );
};

export default CustomRadio;