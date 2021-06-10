import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import theme from '../../themes/theme';

const useStyles = makeStyles(() => ({
  NavBarCallout: {
    backgroundColor: '#c44f65',
    height: '25px',
  },

  NavBarTextBox: {
    minHeight: '25px',
  },
}));

const ChplNonProdIndicator = () => {
  const classes = useStyles();

  return (
    { process.env.NODE_ENV !== 'production' &&
      <ThemeProvider theme={theme}>
        <AppBar color="primary" className={classes.NavBarCallout}>
          <Toolbar className={classes.NavBarTextBox}>
            <Typography variant="body2" noWrap>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
              <b> | </b>
              THIS IS NOT THE PRODUCTION SITE
            </Typography>
          </Toolbar>
        </AppBar>
      </ThemeProvider>}
  );
};

export default ChplNonProdIndicator;

ChplNonProdIndicator.propTypes = {
};
