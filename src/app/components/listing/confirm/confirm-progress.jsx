import React, { useEffect, useState } from 'react';
import {
  Box,
  LinearProgress,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { number, shape, string } from 'prop-types';

import theme from '../../../themes/theme';

function ChplConfirmProgress(props) {
  const [value, setValue] = useState(0);
  const [label, setLabel] = useState('');

  useEffect(() => {
    setValue(props.value.value);
    setLabel(props.value.label);
  }, [props.value]); // eslint-disable-line react/destructuring-assignment

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress
            variant="determinate"
            value={value}
          />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">
            { label}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default ChplConfirmProgress;

ChplConfirmProgress.propTypes = {
  value: shape({
    value: number.isRequired,
    label: string.isRequired,
  }).isRequired,
};
