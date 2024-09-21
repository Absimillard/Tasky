import React, { useState, useRef } from 'react';
import { Typography, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { DateField } from '@mui/x-date-pickers/DateField';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import 'moment/locale/fr'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';

const FieldEdit = ({ defaultValue, onBlur, onSave, fieldName, user, lead, member, team, client, tVariant, inputType }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(defaultValue);
  const [originalValue, setOriginalValue] = useState(defaultValue || '');
  const canEdit = (user?.status === 'team' && user?.role === 'lead' && team && lead) ||
                  (user?.status === 'team' && user?.role === 'member' && team && member) ||
                  (user?.status === 'client' && user?.role === 'lead' && client && lead) ||
                  (user?.status === 'client' && user?.role === 'member' && client && member);
  
  const textFieldRef = useRef(null);

  const handleEditClick = () => {
    if (canEdit) {
      setIsEditing(true);
      setNewValue(originalValue);
    }
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setOriginalValue(newValue); // Update originalValue with newValue
    onSave(fieldName, newValue); // Call onSave with fieldName and newValue
  };
  
  const handleCancelClick = () => {
    setIsEditing(false);
    setNewValue(originalValue); // Reset newValue to originalValue
  };
  const handleChange = (e) => {
    setNewValue(e.target.value);
  };
  const renderInput = () => {
    switch (inputType) {
      case 'TextField':
        return (
          <TextField
            defaultValue={newValue}
            inputRef={textFieldRef}
            onChange={handleChange}
            autoFocus
            onBlur={onBlur}
            disabled={!canEdit}
            fullWidth
          />
        );
        case 'DateField':
          return (
            <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="fr">
              <DateField
              defaultValue={newValue.date}
              onChange={(date) => setNewValue(moment(date._d).format('llll'))}
              autoFocus
              onBlur={onBlur}
              disabled={!canEdit}
              fullWidth
              label="Dash separator"
              format="DD-MM-YYYY"
              />
          </LocalizationProvider>
            
          );
      case 'DataGrid':
        return (
          <DataGrid
            rows={newValue}
            columns={columns}
            pageSize={5}
            autoHeight
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Typography variant={tVariant} onClick={handleEditClick} style={{ cursor: 'pointer' }}>
        {originalValue.toLocaleString()}
      </Typography>
      <Dialog open={isEditing} onClose={handleCancelClick}>
        <DialogTitle>Edit {fieldName}</DialogTitle>
        <DialogContent>
          {renderInput()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveClick}>Save</Button>
          <Button onClick={handleCancelClick}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FieldEdit;
