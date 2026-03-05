import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  envBanner: {
    backgroundColor: `${palette.error}!important`,
    width: '100%',
    color: '#ffffff!important',
    zIndex: theme.zIndex.drawer + 2,
    '& .MuiToolbar-root': {
      minHeight: '25px',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
      overflow: 'hidden',
    },
  },
  envBannerText: {
    fontWeight: 'bold',
    paddingLeft: '8px',
  },
});

function ChplEnvironmentBanner({ text = 'Do not use | Test Environment | '.repeat(20) }) {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.envBanner}>
      <Toolbar>
        <Typography variant="body2" noWrap className={classes.envBannerText}>
          {text}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default ChplEnvironmentBanner;

ChplEnvironmentBanner.propTypes = {
  text: string,
};
