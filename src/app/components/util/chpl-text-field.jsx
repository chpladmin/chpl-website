import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  longLabelFix: {
    padding: '0 4px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 21%, rgba(255,255,255,1) 74%, rgba(255,255,255,1) 75%, rgba(255,255,255,0) 76%, rgba(255,255,255,0) 100%)',
  },
  dates: {
    height: '64px',
    display: 'inline-grid',
  },
}));

function ChplTextField(props) {
  const classes = useStyles();

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      InputLabelProps={{ classes: { root: classes.longLabelFix } }}
      {...props}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplTextField;

ChplTextField.propTypes = {
};
