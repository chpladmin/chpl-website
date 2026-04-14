import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
} from '@material-ui/core';
import { number, string } from 'prop-types';

const CmsDisplayProgressBar = ({ value, year }) => (
  <Box
    pt={2}
    gridGap={8}
    pb={2}
    display="flex"
    alignItems="center"
    justifyContent="space-between"
    id="progress-bar"
  >
    <Box width="56%">
      <LinearProgress
        id="progress-bar-bar"
        variant="determinate"
        value={value}
      />
    </Box>
    <Box>
      <Typography
        variant="body2"
        color="textPrimary"
        id="progress-bar-text"
      >
        <strong>
          { value }
          %
        </strong>
        {' '}
        Base Criteria Met
        {year !== '2015'
           && (
             <>
               {' '}
               for CY
               {year}
             </>
           )}
      </Typography>
    </Box>
  </Box>
);

export default CmsDisplayProgressBar;

CmsDisplayProgressBar.propTypes = {
  value: number.isRequired,
  year: string.isRequired,
};
