import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import { string } from 'prop-types';
import theme from '../../themes/theme';

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
    textAlign: 'center',
    fontSize: '12px',
  },
}));

function ChplTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow placement="top" classes={classes} {...props} />;
}

export { ChplTooltip };

ChplTooltip.propTypes = {
  title: string,
};
