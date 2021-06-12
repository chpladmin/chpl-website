import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import theme from '../../themes/theme';
// eslint-disable-next-line import/no-cycle
import { getAngularService } from '.';

const useStyles = makeStyles(() => ({
  NavBarCallout: {
    backgroundColor: '#c44f65',
    height: '25px',
  },

  NavBarTextBox: {
    minHeight: '25px',
  },
}));

function ChplNonProdIndicator() {
  const networkService = getAngularService('networkService');
  // eslint-disable-next-line react/destructuring-assignment
  const [production, setProduction] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    networkService.getSystemStatus()
      .then((response) => {
        let headerValue = '';
        if (response.headers('Environment')) {
          headerValue = response.headers('Environment');
        } else if (response.headers('environment')) {
          headerValue = response.headers('environment');
        }
        setProduction(headerValue === 'PRODUCTION');
      });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <>
        { !production
          && (
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
          )}
      </>
    </ThemeProvider>
  );
}

export default ChplNonProdIndicator;

ChplNonProdIndicator.propTypes = {
};
