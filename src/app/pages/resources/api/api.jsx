import React from 'react';
import {
  Divider,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import { ChplLink } from '../../../components/util';
import { ChplApiKeyRegistration } from '../../../components/api-key';
import ChplSwagger from './swagger';

const useStyles = makeStyles({
  pageHeader: {
    padding: '32px',
  },
  pageBody: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    padding: '32px',
    backgroundColor: '#f9f9f9',
  },
  content: {
    display: 'grid',
    gap: '32px',
    alignItems: 'start',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '7fr 5fr',
    },
  },
  fullWidth: {
    gridColumnEnd: 'span 2',
  },
});

function ChplResourcesApi() {
  const classes = useStyles();
  const url = 'http://localhost:3000/rest/v3/api-docs';
  //`${$location.absUrl().split('#')[0]}rest/v3/api-docs`;

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.pageHeader}>
        <Typography
          variant="h1"
        >
          CHPL API
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography
          variant="h2"
        >
          Access API Documentation
        </Typography>
        <Divider />
        <div className={classes.content}>
          <div>
            <Typography
              gutterBottom
            >
              The ONC CHPL API provides programmatic access to ONC published data on Certified Health IT Products. ONC CHPL&apos;s API includes methods for retrieving a subset of our statistical data and the metadata that describes it. Users must complete the CHPL API registration. After completing the CHPL API registration, the user will be given a unique 32-character API key. This API key will also be emailed to the user.
            </Typography>
            <Typography
              gutterBottom
            >
              This API key must be used when making a call to the CHPL API. For example, if you wanted to implement the /search API with the searchTerm parameter set as Epic, you would make the following call (switching out the key in the URL for your key):
            </Typography>
            <pre>https://chpl.healthit.gov/rest/search/?api_key=YOURKEYHERE&searchTerm=Epic</pre>
            <Typography
              gutterBottom
            >
              A sample Java application using the CHPL API can be found at
              {' '}
              <ChplLink href="https://github.com/chpladmin/sample-application" text="Sample Application" analytics={{ event: 'Go to Sample Application Page', catgory: 'CHPL API' }} />
            </Typography>
            <Typography
              gutterBottom
            >
              Release notes for the CHPL API can be found in the
              {' '}
              <ChplLink href="https://github.com/chpladmin/chpl-api/blob/master/RELEASE_NOTES.md" text="release notes on GitHub" analytics={{ event: 'Go to Release Notes on GitHub', catgory: 'CHPL API' }} />
            </Typography>
          </div>
          <div>
            <ChplApiKeyRegistration />
          </div>
          <div
            className={classes.fullWidth}
          >
            <ChplSwagger
              url={url}
            />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ChplResourcesApi;
