import React, { useEffect } from 'react';
import {
  Container,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Link,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper';

const useStyles = makeStyles({
  container: {
    padding: '64px 32px',
    maxWidth: '90%',
    [theme.breakpoints.up('sm')]: {
      maxWidth: '80%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '70%',
    },
    [theme.breakpoints.up('lg')]: {
      maxWidth: '60%',
    },
    [theme.breakpoints.up('xl')]: {
      maxWidth: '50%',
    },
  },
  cardActions: {
    padding: '16px',
  },
});

function ChplNotFound() {
  const $analytics = getAngularService('$analytics');
  const $stateParams = getAngularService('$stateParams');
  const classes = useStyles();

  useEffect(() => {
    const { target } = $stateParams;
    if (target) {
      $analytics.eventTrack('Page Not Found', { category: 'Navigation', label: target });
    }
  }, [$analytics, $stateParams]);

  return (
    <ThemeProvider theme={theme}>
      <Container className={classes.container}>
        <Card>
          <CardHeader title="404 Page Not Found" />
          <CardContent>
            <Typography
              variant="body1"
            >
              The page you were looking for may have been moved to a new location or no longer exists. Use the links below to either return to the search page or contact us to report a problem with the CHPL site.
            </Typography>
          </CardContent>
          <CardActions className={classes.cardActions}>
            <Typography>
              <Link
                href="#/search"
              >
                Back to Search
              </Link>
            </Typography>
            <Typography>|</Typography>
            <Typography>
              <Link
                href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51"
              >
                Support Portal
              </Link>
            </Typography>
          </CardActions>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default ChplNotFound;
