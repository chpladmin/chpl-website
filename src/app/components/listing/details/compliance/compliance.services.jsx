import React from 'react';
import {
  Typography,
  Box,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

import { ChplTooltip } from 'components/util';

const getDataDisplay = (title, value, tooltip, fullWidth = false) => (
  <Box width={fullWidth ? '100%' : '48%'} alignItems={fullWidth ? 'flex-start' : 'center'} gridGap="8px" display="flex" justifyContent="space-between">
    <Box display="flex" flexDirection="column" width="100%">
      <Typography variant="subtitle2">
        { title }
      </Typography>
      { value }
    </Box>
    <Box>
      <ChplTooltip
        title={tooltip}
      >
        <InfoIcon color="primary" />
      </ChplTooltip>
    </Box>
  </Box>
);

export {
  getDataDisplay,
};
