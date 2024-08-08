import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import { number } from 'prop-types';

function PasswordStrengthMeter(props) {
  /* eslint-disable react/destructuring-assignment */
  const score = props.value * 25;
  let text;
  switch (props.value) {
    case 0: text = 'Awful'; break;
    case 1: text = 'Weak'; break;
    case 2: text = 'Moderate'; break;
    case 3: text = 'Strong'; break;
    case 4: text = 'Excellent'; break;
    default: text = 'Awful';
  }
  const newProps = {
    ...props,
    value: score,
  };
  /* eslint-enable react/destructuring-assignment */

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress
          variant="determinate"
          {...newProps}
        />
      </Box>
      <Box minWidth={70}>
        <Typography variant="body2" color="textSecondary">
          { text }
        </Typography>
      </Box>
    </Box>
  );
}

export default PasswordStrengthMeter;

PasswordStrengthMeter.propTypes = {
  value: number.isRequired,
};
