import React from 'react';
import { TextField } from '@mui/material';
import { string } from 'prop-types';

// native pickers always show a placeholder (e.g. mm/dd/yyyy), so their label has to stay shrunk
const pickerTypes = ['date', 'datetime-local', 'month', 'time', 'week'];

const styles = {
  longLabelFix: {
    padding: '0 4px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 21%, rgba(255,255,255,1) 74%, rgba(255,255,255,1) 75%, rgba(255,255,255,0) 76%, rgba(255,255,255,0) 100%)',
  },
};

function ChplTextField(props) {
  const { type } = props;

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      InputLabelProps={{
        sx: styles.longLabelFix,
        ...(pickerTypes.includes(type) && { shrink: true }),
      }}
      {...props}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplTextField;

ChplTextField.propTypes = {
  type: string,
};
