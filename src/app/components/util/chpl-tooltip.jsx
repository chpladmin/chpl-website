import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import { node, oneOfType, string } from 'prop-types';

import theme from '../../themes/theme';

const useStylesBootstrap = makeStyles({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    textAlign: 'center',
    fontSize: '12px',
  },
});

function ChplTooltip(props) {
  const classes = useStylesBootstrap();

  /* eslint-disable react/jsx-props-no-spreading */
  return <Tooltip arrow placement="top" classes={classes} {...props} />;
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplTooltip;

ChplTooltip.propTypes = {
  title: oneOfType([node, string]).isRequired,
};
