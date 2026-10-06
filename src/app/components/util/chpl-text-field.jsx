import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { string } from 'prop-types';

const styles = {
  longLabelFix: {
    padding: '0 4px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 21%, rgba(255,255,255,1) 74%, rgba(255,255,255,1) 75%, rgba(255,255,255,0) 76%, rgba(255,255,255,0) 100%)',
  },
  date: {
    height: '64px',
    display: 'inline-flex',
    paddingTop: '16px',
  },
};

function ChplTextField(props) {
  const { type = undefined } = props;
  const [isDate, setIsDate] = useState(false);

  useEffect(() => {
    setIsDate(type === 'date');
  }, []);

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      InputLabelProps={{ sx: styles.longLabelFix }}
      InputProps={{ sx: isDate ? styles.date : undefined }}
      {...props}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplTextField;

ChplTextField.propTypes = {
  type: string,
};
