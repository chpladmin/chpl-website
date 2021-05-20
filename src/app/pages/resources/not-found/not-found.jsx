import React from 'react';
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

const useStyles = makeStyles(() => ({
}));

function ChplNotFound() {
  const $state = getAngularService('$state');
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Card>
          <CardHeader title="404 Page Not Found" />
          <CardContent>
            <Typography
              variant="body1"
            >
              The page you were looking for may have been moved to a new location or no longer exists. Use the buttons below to either return to the search page or contact us to report a problem with the CHPL site.
            </Typography>
          </CardContent>
          <CardActions>
            <Link
              color="primary"
              href="#/search"
            >
              Back to Search
            </Link>
            <Link
              color="primary"
              href="http://www.google.com"
            >
              Support Portal
            </Link>
          </CardActions>
        </Card>
      </Container>
    </ThemeProvider>
  );
}

export default ChplNotFound;
