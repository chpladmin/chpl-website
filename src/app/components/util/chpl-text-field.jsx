import React, { useEffect, useState } from 'react';
import {
  TextField,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

const useStyles = makeStyles({
  longLabelFix: {
    padding: '0 4px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,1) 21%, rgba(255,255,255,1) 74%, rgba(255,255,255,1) 75%, rgba(255,255,255,0) 76%, rgba(255,255,255,0) 100%)',
  },
  date: {
    height: '64px',
    display: 'inline-grid',
  },
});

function ChplTextField(props) {
  const { type } = props;
  const classes = useStyles();
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
      InputLabelProps={{ classes: { root: classes.longLabelFix } }}
      InputProps={{ className: isDate ? classes.date : '' }}
      {...props}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplTextField;

ChplTextField.propTypes = {
  type: string,
};

ChplTextField.defaultProps = {
  type: undefined,
};
