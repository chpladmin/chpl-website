import React, { useState } from 'react';
import {
  Button,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

const useStyles = makeStyles({
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplDeleteButton() {
  const classes = useStyles();

  return (
    <Button className={classes.deleteButton} variant="contained">
    Delete Button
    <DeleteOutlinedIcon className={classes.iconSpacing}
    fontSize="small"
    />
    </Button>
  );
}

export default ChplDeleteButton;
