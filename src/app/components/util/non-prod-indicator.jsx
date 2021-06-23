import React, { useEffect, useState } from 'react';
import { Toolbar } from '@material-ui/core';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import theme from '../../themes/theme';
import { getAngularService } from '../../services/angular-react-helper';

const useStyles = makeStyles(() => ({
  toolBar: {
    minHeight: '25px',
    backgroundColor: '#c44f65',
    width: '100%',
    color: '#ffffff',
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
        // Local environments send the header key in all lower case
        // but other environments send the header key capitalized
        if (response.headers('Environment')) {
          headerValue = response.headers('Environment');
        } else if (response.headers('environment')) {
          headerValue = response.headers('environment');
        }
        setProduction(headerValue.toUpperCase() === 'PRODUCTION');
      });
  }, []);

  // This will prevent the component from rendering in PROD env
  if (production) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Toolbar className={classes.toolBar} id="non-prod-indicator">
        <Typography variant="body2" noWrap>
          {
            Array.from({ length: 15 }, (_, idx) => (
              <span key={idx}>
                TEST ENVIRONMENT – DO NOT USE
                <b> | </b>
              </span>
            ))
          }
        </Typography>
      </Toolbar>
    </ThemeProvider>
  );
}

export default ChplNonProdIndicator;

ChplNonProdIndicator.propTypes = {
};
