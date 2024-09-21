import React from 'react';
import { Link } from "react-router-dom";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { tokens } from "../theme";

const AddButton = ({ title, to, icon }) => {
        const theme = useTheme();
        const colors = tokens(theme.palette.mode);
        return (
          <Box sx={{display:"inline-block", height:"fit-content"}}>
          <Button component={Link} to={to}
            style={{
              color: colors.grey[100],
            }}
            icon={icon}>
            <Typography>{title}</Typography>
          </Button>
          </Box>
        );
      };

export default AddButton