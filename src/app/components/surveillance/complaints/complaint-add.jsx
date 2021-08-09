import React from 'react';
import {
  Button,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import AddIcon from '@material-ui/icons/Add';

import theme from '../../../themes/theme';

const useStyles = makeStyles(() => ({
  iconSpacing: {
    marginLeft: '4px',
  },
}));

function ChplComplaintAdd(props) {
  const classes = useStyles();

  const handleAction = (action) => {
    props.dispatch(action);
  };

  return (
    <ThemeProvider theme={theme}>
      <Button
        onClick={() => handleAction('add')}
        color="primary"
        variant="outlined"
      >
        Add New Complaint
        <AddIcon
          className={classes.iconSpacing}
        />
      </Button>
    </ThemeProvider>
  );
}

export default ChplComplaintAdd;

ChplComplaintAdd.propTypes = {
  dispatch: func.isRequired,
};
