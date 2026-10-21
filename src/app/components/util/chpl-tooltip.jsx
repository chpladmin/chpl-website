import React from 'react';
import { Tooltip } from '@mui/material';
import { node, oneOfType, string } from 'prop-types';

import theme from '../../themes/theme';

const styles = {
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    textAlign: 'center',
    fontSize: '12px',
  },
};

function ChplTooltip(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Tooltip
      arrow
      placement="top"
      componentsProps={{
        arrow: { sx: styles.arrow },
        tooltip: { sx: styles.tooltip },
      }}
      {...props}
    />
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplTooltip;

ChplTooltip.propTypes = {
  title: oneOfType([node, string]).isRequired,
};
