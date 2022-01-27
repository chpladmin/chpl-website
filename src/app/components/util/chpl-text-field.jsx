import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  longLabelFix: {
    paddingRight: '4px',
    background: 'rgb(255,255,255)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 21%, rgba(255,255,255,1) 59%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)',
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
