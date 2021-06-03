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
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';

import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper';

const useStyles = makeStyles({
  container: {
    padding: '32px',
  },
});

function ChplNotFound() {
  const $analytics = getAngularService('$analytics');
  const $stateParams = getAngularService('$stateParams');
  const classes = useStyles();

  useEffect(() => {
    const { target } = $stateParams;
    if (target) {
      $analytics.eventTrack('Page Not Found', { category: 'navigation', label: target });
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
          <CardActions>
            <Link
              href="#/search"
            >
              Back to Search
              {' '}
              <ArrowBackIcon fontSize="default" />
            </Link>
            <div>|</div>
            <Link
              href="https://www.healthit.gov/form/healthit-feedback-form"
            >
              Support Portal
              {' '}
              <SupervisedUserCircleIcon fontSize="default" />
            </Link>
          </CardActions>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default ChplNotFound;
