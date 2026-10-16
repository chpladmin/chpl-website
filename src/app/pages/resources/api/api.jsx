import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Skeleton,
  Typography,
} from '@mui/material';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { useSelector } from 'react-redux';
import SwaggerUI from 'swagger-ui-react';

import {
  ChplLink,
  ChplPageBody,
  ChplPageHeader,
  ChplSkeletonCard,
  ChplTextField,
  skeletonLineColor,
} from 'components/util';
import { ChplApiKeyRegistration } from 'components/api-key';
import { eventTrack } from 'services/analytics.service';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const styles = {
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
  hidden: {
    display: 'none',
  },
  pageBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  swaggerCardContent: {
    padding: '16px',
    '&:last-child': {
      paddingBottom: '16px',
    },
    '& .swagger-ui': {
      '& .btn.authorize': {
        borderColor: '#384903',
        color: '#384903',
      },
      '& .btn.authorize svg': {
        fill: '#384903',
      },
      '& .info': {
        borderTop: 'none',
        margin: '0 0 24px',
        paddingTop: '32px',
      },
      '& .info a': {
        color: palette.primary,
        textDecoration: 'underline',
      },
      '& .info .title': {
        color: '#3b4151',
        fontFamily: 'Lato',
        fontSize: '1.75em',
        fontWeight: 400,
        margin: 0,
      },
      '& .info .title small': {
        background: palette.black,
      },
      '& .info .title small.version-stamp': {
        backgroundColor: '#384903',
      },
      '& .opblock.opblock-get': {
        borderColor: palette.primary,
      },
      '& .opblock.opblock-get .opblock-summary-method': {
        background: palette.primary,
      },
      '& .opblock.opblock-put': {
        borderColor: '#7a5000',
      },
      '& .opblock.opblock-put .opblock-summary-method': {
        background: '#7a5000',
      },
      '& .opblock.opblock-post': {
        borderColor: '#384903',
      },
      '& .opblock.opblock-post .opblock-summary-method': {
        background: '#384903',
      },
      '& .opblock.opblock-delete': {
        borderColor: palette.error,
      },
      '& .opblock.opblock-delete .opblock-summary-method': {
        background: palette.error,
      },
      '& .opblock.opblock-deprecated': {
        opacity: 1,
      },
      '& .opblock.opblock-deprecated .opblock-summary-method': {
        background: '#eeeeee',
        color: '#3b495f',
      },
      '& .parameter__name .required span': {
        color: palette.error,
        fontSize: '24px',
        verticalAlign: 'middle',
      },
      '& pre': {
        backgroundColor: 'transparent',
        border: 'none',
      },
      '& .servers': {
        paddingTop: '8px',
      },
      '& .wrapper': {
        maxWidth: 'none',
        padding: '0 8px',
      },
      '@media only screen and (max-width: 600px)': {
        '& .scheme-container .schemes': {
          display: 'grid',
          gap: '8px',
          gridTemplateColumns: '1fr',
          justifyItems: 'start',
        },
      },
    },
  },
  downloadSection: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'start',
    gridColumn: '1 / -1',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr auto',
    },
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
};

const allOptions = [
  'Active products',
  'Inactive products',
  '2014 edition products',
  '2011 edition products',
];

// The Swagger UI card: the API title, then a row per group of operations
const loadingStyles = {
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '48px 16px 16px',
  },
  info: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '24px',
  },
  group: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '12px 0',
    borderBottom: `1px solid ${skeletonLineColor}`,
  },
};

const groupWidths = ['20%', '28%', '16%', '24%', '30%', '18%', '22%', '26%'];

function ChplApiSwaggerLoading() {
  return (
    <ChplSkeletonCard>
      <Box sx={loadingStyles.content} aria-hidden="true">
        <Box sx={loadingStyles.info}>
          <Skeleton variant="text" width="30%" height={40} />
          <Skeleton variant="text" width="45%" height={22} />
        </Box>
        { groupWidths.map((width) => (
          <Box key={width} sx={loadingStyles.group}>
            <Skeleton variant="text" width={width} height={32} />
            <Skeleton variant="circular" width={20} height={20} />
          </Box>
        ))}
      </Box>
    </ChplSkeletonCard>
  );
}

function ChplResourcesApi() {
  const apiKey = useSelector((state) => state.browserInfo.apiKey);
  const API = useSelector((state) => state.browserInfo.api);
  const analytics = {
    ...useAnalyticsContext().analytics,
    category: 'CHPL API',
  };
  const [files, setFiles] = useState({});
  const [downloadOptions, setDownloadOptions] = useState(allOptions);
  const [selectedOption, setSelectedOption] = useState('Active products');
  const url = `${window.location.href.split('#')[0]}rest/v3/api-docs`;
  // Swagger UI fetches the definition itself after it mounts, so it renders
  // hidden behind a skeleton until it is done. If onComplete never comes, as
  // when the definition can't be fetched, show it anyway so its error is seen
  const [swaggerIsReady, setSwaggerIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSwaggerIsReady(true), 10000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const data = {
      'Active products': { data: `${API}/listings/download?listingType=active&api_key=${apiKey}&format=json`, label: 'Active products' },
      'Inactive products': { data: `${API}/listings/download?listingType=inactive&api_key=${apiKey}&format=json`, label: 'Inactive products' },
      '2014 edition products': { data: `${API}/listings/download?listingType=2014&api_key=${apiKey}&format=json`, label: '2014 edition products' },
      '2011 edition products': { data: `${API}/listings/download?listingType=2011&api_key=${apiKey}&format=json`, label: '2011 edition products' },
    };
    setFiles(data);
    setDownloadOptions(() => allOptions);
  }, [API, apiKey]);

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
      <ChplPageHeader text="CHPL API" />
      <ChplPageBody>
        <Box sx={styles.pageBody}>
          <Box sx={styles.fullWidth}>
            <Typography
              variant="h4"
              component="h2"
            >
              Definitions & Guidelines
            </Typography>
            <Typography sx={styles.listHeaders} gutterBottom variant="h6">Certified Health IT Products</Typography>
            <Divider />
          </Box>
          <Box sx={styles.downloadSection}>
            <Card>
              <CardContent>
                <Box component="ul" sx={styles.listSpacing}>
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
                </Box>
              </CardContent>
            </Card>
            <Card sx={styles.downloadCard}>
              <CardHeader title="Select A File To Download" />
              <CardContent>
                <Box display="flex" flexDirection="column" gap="16px">
                  <Typography>
                    To download a list of certified health IT products listed on the CHPL, please select from one of the categories below in the dropdown menu, and then click the Data File button.
                  </Typography>
                  <Box sx={styles.fullWidth}>
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
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  color="primary"
                  variant="contained"
                  id="download-chpl-data-button"
                  onClick={() => downloadFile('data')}
                  endIcon={<CloudDownloadOutlinedIcon />}
                >
                  Download Data File
                </Button>
              </CardActions>
            </Card>
          </Box>
          <Box sx={styles.fullWidth}>
            <Typography
              variant="h4"
              component="h2"
            >
              Access API Documentation
            </Typography>
            <Divider />
          </Box>
          <Box sx={styles.downloadSection}>
            <Card>
              <CardContent>
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
              </CardContent>
            </Card>
            <Box sx={styles.downloadCard}>
              <AnalyticsContext.Provider value={{ analytics }}>
                <ChplApiKeyRegistration />
              </AnalyticsContext.Provider>
            </Box>
          </Box>
          { !swaggerIsReady && <ChplApiSwaggerLoading /> }
          <Card sx={[styles.fullWidth, !swaggerIsReady && styles.hidden]}>
            <CardContent sx={styles.swaggerCardContent}>
              <SwaggerUI
                url={url}
                docExpansion="none"
                supportedSubmitMethods={[]}
                onComplete={() => setSwaggerIsReady(true)}
              />
            </CardContent>
          </Card>
        </Box>
      </ChplPageBody>
    </>
  );
}

export default ChplResourcesApi;
