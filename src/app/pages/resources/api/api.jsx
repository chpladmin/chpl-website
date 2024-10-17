import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import SwaggerUI from 'swagger-ui-react';

import { ChplLink, ChplTextField } from 'components/util';
import { ChplApiKeyRegistration } from 'components/api-key';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  downloadCard: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '350px',
    },
  },
  fullWidth: {
    gridColumn: '1 / -1',
  },
  pageBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: palette.background,
    padding: '32px 0',
  },
  downloadSection: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
    gridColumn: '1 / -1',
  },
  listHeaders: {
    marginBottom: '8px',
  },
  listSpacing: {
    '& li': {
      lineHeight: '1.3em',
      marginBottom: '.7em',
      marginTop: '.7em',
    },
  },
  pageHeader: {
    padding: '32px 0',
    backgroundColor: palette.white,
  },
  warningBox: {
    padding: '16px',
    backgroundColor: palette.warningLight,
    border: `1px solid ${palette.grey}`,
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '4px',
    marginBottom: '16px',
    gridGap: '16px',
    alignItems: 'center',
  },
});

const allOptions = [
  'Active products',
  'Inactive products',
  '2014 edition products',
  '2011 edition products',
];

function ChplResourcesApi() {
  const API = getAngularService('API');
  const {
    getApiKey,
    getToken,
    hasAnyRole,
  } = getAngularService('authService');
  const analytics = {
    ...useAnalyticsContext().analytics,
    category: 'CHPL API',
  };
  const [files, setFiles] = useState({});
  const [downloadOptions, setDownloadOptions] = useState(allOptions);
  const [selectedOption, setSelectedOption] = useState('Active products');
  const classes = useStyles();
  const url = `${window.location.href.split('#')[0]}rest/v3/api-docs`;

  useEffect(() => {
    const data = {
      'Active products': { data: `${API}/listings/download?listingType=active&api_key=${getApiKey()}&format=json`, label: 'Active products' },
      'Inactive products': { data: `${API}/listings/download?listingType=inactive&api_key=${getApiKey()}&format=json`, label: 'Inactive products' },
      '2014 edition products': { data: `${API}/listings/download?listingType=2014&api_key=${getApiKey()}&format=json`, label: '2014 edition products' },
      '2011 edition products': { data: `${API}/listings/download?listingType=2011&api_key=${getApiKey()}&format=json`, label: '2011 edition products' },
    };
    setFiles(data);
    setDownloadOptions(() => allOptions);
  }, [API, getApiKey, getToken]);

  const downloadFile = (type) => {
    if (selectedOption) {
      eventTrack({
        ...analytics,
        event: 'Download CHPL Data File',
        label: files[selectedOption].label,
      });
      window.open(files[selectedOption][type]);
    }
  };

  return (
    <>
      <Box bgcolor={palette.background}>
        <div className={classes.pageHeader}>
          <Container maxWidth="lg">
            <Typography
              variant="h1"
            >
              CHPL API
            </Typography>
          </Container>
        </div>
        <Container maxWidth="lg">
          <div className={classes.pageBody} id="main-content" tabIndex="-1">
            <Box className={classes.fullWidth}>
              <Typography
                variant="h4"
                component="h2"
              >
                Definitions & Guidelines
              </Typography>
              <Typography className={classes.listHeaders} gutterBottom variant="h6">Certified Health IT Products</Typography>
              <Divider />
            </Box>
            <div className={classes.downloadSection}>
              <Box width="66%">
                <ul className={classes.listSpacing}>
                  <li>
                    <Typography gutterBottom><strong>Certified Products:</strong></Typography>
                    {' '}
                    Entire collection of a set of certified products, including all data elements. The file is in a JSON format, and the definition of that structure can be found in the &quot;Schemas&quot; section of the &quot;Certified Health IT Product Listing API&quot; documentation.
                    <ul>
                      <li>
                        The Active products summary file is updated nightly.
                      </li>
                      <li>
                        The Inactive products summary file is updated nightly.
                      </li>
                      <li>
                        The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.
                      </li>
                    </ul>
                  </li>
                </ul>
              </Box>
              <Card className={classes.downloadCard}>
                <CardHeader title="Select A File To Download" />
                <CardContent>
                  <Box display="flex" flexDirection="column" gridGap={16}>
                    <Typography>
                      To download a list of certified health IT products listed on the CHPL, please select from one of the categories below in the dropdown menu, and then click the Data File button.
                    </Typography>
                    <div className={classes.fullWidth}>
                      <ChplTextField
                        select
                        id="download-select"
                        name="downloadSelect"
                        label="Select a collection to download"
                        value={selectedOption}
                        onChange={(event) => setSelectedOption(event.target.value)}
                      >
                        { downloadOptions.map((item) => (
                          <MenuItem value={item} key={item}>{item}</MenuItem>
                        ))}
                      </ChplTextField>
                    </div>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    color="primary"
                    variant="contained"
                    id="download-chpl-data-button"
                    onClick={() => downloadFile('data')}
                  >
                    Download Data File
                    {' '}
                    <GetAppIcon className={classes.iconSpacing} />
                  </Button>
                </CardActions>
              </Card>
            </div>
            <div className={classes.fullWidth}>
              <Typography
                variant="h4"
                component="h2"
              >
                Access API Documentation
              </Typography>
              <Divider />
            </div>
            <div className={classes.downloadSection}>
              <Box width="66%">
                <Typography
                  gutterBottom
                >
                  The ONC CHPL API provides programmatic access to ONC published data on Certified Health IT Products. ONC CHPL&apos;s API includes methods for retrieving a subset of our statistical data and the metadata that describes it. Users must complete the CHPL API registration. After completing the CHPL API registration, the user will be given a unique 32-character API key. This API key will also be emailed to the user.
                </Typography>
                <Typography
                  gutterBottom
                >
                  This API key must be used when making a call to the CHPL API. For example, if you wanted to implement the /acbs API, you would make the following call (switching out the key in the URL for your key):
                  {' '}
                  <code>https://chpl.healthit.gov/rest/acbs?api_key=YOUR_KEY_HERE</code>
                </Typography>
                <br />
                <Typography
                  gutterBottom
                >
                  A sample Java application using the CHPL API can be found at
                  {' '}
                  <ChplLink
                    href="https://github.com/chpladmin/sample-application"
                    text="Sample Application"
                    analytics={{
                      ...analytics,
                      event: 'Go to Sample Aplication',
                    }}
                    inline
                  />
                </Typography>
                <br />
                <Typography
                  gutterBottom
                >
                  Release notes for the CHPL API can be found in the
                  {' '}
                  <ChplLink
                    href="https://github.com/chpladmin/chpl-api/blob/master/RELEASE_NOTES.md"
                    text="release notes on GitHub"
                    analytics={{
                      ...analytics,
                      event: 'Go to release notes on GitHub',
                    }}
                    inline
                  />
                </Typography>
              </Box>
              <div className={classes.downloadCard}>
                <AnalyticsContext.Provider value={{ analytics }}>
                  <ChplApiKeyRegistration />
                </AnalyticsContext.Provider>
              </div>
            </div>
            <div
              className={classes.fullWidth}
            >
              { hasAnyRole(['chpl-api'])
                ? (
                  <SwaggerUI
                    url={url}
                    docExpansion="none"
                  />
                )
                : (
                  <SwaggerUI
                    url={url}
                    docExpansion="none"
                    supportedSubmitMethods={[]}
                  />
                )}
            </div>
          </div>
        </Container>
      </Box>
    </>
  );
}

export default ChplResourcesApi;
