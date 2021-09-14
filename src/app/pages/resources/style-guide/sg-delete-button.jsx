import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

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

function SgDeleteButton() {
  const classes = useStyles();

  return (
    <Button size="medium" className={classes.deleteButton} variant="contained">
    Delete Button
    <DeleteOutlinedIcon className={classes.iconSpacing}
    fontSize="small"
    />
    </Button>
  );
}

export default SgDeleteButton;
