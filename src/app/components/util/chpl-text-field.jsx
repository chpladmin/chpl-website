import React from 'react';
import { TextField } from '@mui/material';
import { string } from 'prop-types';

const styles = {
  longLabelFix: {
    padding: '0 4px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 21%, rgba(255,255,255,1) 74%, rgba(255,255,255,1) 75%, rgba(255,255,255,0) 76%, rgba(255,255,255,0) 100%)',
  },
};

function ChplTextField(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      InputLabelProps={{ sx: styles.longLabelFix }}
      {...props}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplTextField;

ChplTextField.propTypes = {
  type: string,
};
