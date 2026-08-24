import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { useSelector } from 'react-redux';

import {
  ChplLink,
  ChplPageBody,
  ChplPageHeader,
  ChplTextField,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  downloadCard: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '350px',
    },
  },
  downloadSection: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'start',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr auto',
    },
  },
  listSpacing: {
    '& li': {
      lineHeight: '1.3em',
      marginBottom: '.7em',
      marginTop: '.7em',
    },
  },
  listHeaders: {
    marginBottom: '8px',
  },
  content: {
    display: 'flex',
    gap: '16px',
    marginTop: '32px',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  infoBox: {
    padding: '16px',
    backgroundColor: palette.secondary,
    border: `1px solid ${palette.primary}`,
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'row',
    marginTop: '16px',
    marginBottom: '16px',
    gridGap: '16px',
    alignItems: 'center',
  },
});

const allOptions = [
  'Active products summary',
  'Inactive products summary',
  '2014 edition summary',
  'SVAP Summary',
  'Service Base URL List',
  'Surveillance Activity',
  'Surveillance (Basic)',
  'Surveillance Non-Conformities',
  'Direct Review Activity',
];

function ChplResourcesDownload() {
  const apiKey = useSelector((state) => state.browserInfo.apiKey);
  const API = useSelector((state) => state.browserInfo.api);
  const analytics = {
    ...useAnalyticsContext().analytics,
    category: 'Download the CHPL',
  };
  const { hasAnyRole } = useContext(UserContext);
  const [files, setFiles] = useState({});
  const [downloadOptions, setDownloadOptions] = useState(allOptions);
  const [selectedOption, setSelectedOption] = useState('Active products summary');
  const classes = useStyles();

  useEffect(() => {
    const data = {
      'Active products summary': { data: `${API}/listings/download?listingType=active&api_key=${apiKey}&format=csv`, definition: `${API}/listings/download?listingType=active&api_key=${apiKey}&format=csv&definition=true`, label: 'Active products' },
      'Inactive products summary': { data: `${API}/listings/download?listingType=inactive&api_key=${apiKey}&format=csv`, definition: `${API}/listings/download?listingType=inactive&api_key=${apiKey}&format=csv&definition=true`, label: 'Inactive products' },
      '2014 edition summary': { data: `${API}/listings/download?listingType=2014&api_key=${apiKey}&format=csv`, definition: `${API}/listings/download?listingType=2014&api_key=${apiKey}&format=csv&definition=true`, label: '2014 products' },
      'SVAP Summary': { data: `${API}/svap/download?api_key=${apiKey}`, definition: `${API}/svap/download?api_key=${apiKey}&definition=true`, label: 'SVAP Summary' },
      'Service Base URL List': { data: `${API}/service-base-url-list/download?api_key=${apiKey}`, label: 'Service Base URL List' },
      'Surveillance (Basic)': { data: `${API}/surveillance/download?api_key=${apiKey}&type=basic&authorization=Bearer%20${JSON.parse(localStorage.getItem('ngStorage-jwtToken'))}`, definition: `${API}/surveillance/download?api_key=${apiKey}&type=basic&definition=true&authorization=Bearer%20${JSON.parse(localStorage.getItem('ngStorage-jwtToken'))}`, label: 'Surveillance (Basic)' },
      'Surveillance Activity': { data: `${API}/surveillance/download?api_key=${apiKey}&type=all`, definition: `${API}/surveillance/download?api_key=${apiKey}&type=all&definition=true`, label: 'Surveillance' },
      'Surveillance Non-Conformities': { data: `${API}/surveillance/download?api_key=${apiKey}`, definition: `${API}/surveillance/download?api_key=${apiKey}&definition=true`, label: 'Surveillance Non-Conformities' },
      'Direct Review Activity': { data: `${API}/developers/direct-reviews/download?api_key=${apiKey}`, definition: `${API}/developers/direct-reviews/download?api_key=${apiKey}&definition=true`, label: 'Direct Review Activity' },
    };
    setFiles(data);
    setDownloadOptions(() => allOptions.filter((option) => {
      if (option === 'Surveillance (Basic)' && !hasAnyRole(['chpl-admin', 'chpl-onc'])) {
        return false;
      }
      return true;
    }));
  }, [API, hasAnyRole]);

  const downloadFile = (type) => {
    if (selectedOption) {
      eventTrack({
        ...analytics,
        event: `Download CHPL ${type === 'definition' ? 'Definition' : 'Data'} File`,
        label: files[selectedOption].label,
      });
      window.open(files[selectedOption][type]);
    }
  };

  return (
    <>
      <ChplPageHeader text="Download the Latest Certified Health IT Product List" />
      <ChplPageBody>
        <div>
          <Typography
            variant="h4"
            component="h2"
          >
            Definitions & Guidelines
          </Typography>
          <Typography className={classes.listHeaders} gutterBottom variant="h6">Certified Health IT Products</Typography>
          <Divider />
          <div className={classes.content}>
            <Box className={classes.downloadSection}>
              <Card>
                <CardContent>
                  <ul className={classes.listSpacing}>
                    <li>
                      <Typography gutterBottom><strong>Certified Products Summary:</strong></Typography>
                      {' '}
                      Entire collection of a set of certified products, with only a subset of data elements included. Data elements included are: Certification edition, CHPL ID, ONC-ACB Certification ID, Certification Date, ONC-ACB Name, Developer Name, Product Name, Version, Practice Type (only for 2014 Edition products), Certification Status, Previous Certifying ACB, Total Number of Corrective Action Plans Over Time, Count of Currently Open Corrective Action Plans, and Certification Criteria to which that Certified Product attests.
                      <ul>
                        <li>
                          The Active products summary file is updated nightly.
                        </li>
                        <li>
                          The Inactive products summary file is updated nightly.
                        </li>
                        <li>
                          The 2014 Edition Summary file is updated quarterly.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <Typography gutterBottom><strong>Standards Version Advancement Process (SVAP) Summary:</strong></Typography>
                      {' '}
                      Entire collection of SVAP values that have been associated with a criterion for a certified product. Multiple rows for a single product will appear in the file for any products containing multiple SVAP values and/or SVAP values for multiple criteria. Updated nightly.
                    </li>
                  </ul>
                  <Box className={classes.infoBox}>
                    <InfoOutlinedIcon color="primary" />
                    <Typography>
                      The JSON files have been moved to the
                      {' '}
                      <ChplLink
                        text="CHPL API page"
                        external={false}
                        inline
                        href="#/resources/api"
                        router={{ sref: 'resources.api' }}
                        analytics={{
                          ...analytics,
                          event: 'Navigate to CHPL API page',
                        }}
                      />
                      .
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
              <Card className={classes.downloadCard}>
                <CardHeader title="Select A File To Download" />
                <CardContent>
                  <Box display="flex" flexDirection="column" gridGap={16}>
                    <Typography> To download a list of certified health IT products or compliance activities listed on the CHPL, please select from one of the categories below in the dropdown menu, and then click the Data File or Definition File button as needed.</Typography>
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
                    endIcon={<CloudDownloadOutlinedIcon />}
                  >
                    Data File
                  </Button>
                  { files[selectedOption]?.definition
                    && (
                      <Button
                        fullWidth
                        color="primary"
                        variant="text"
                        id="download-chpl-definition-button"
                        onClick={() => downloadFile('definition')}
                      >
                        Definition File
                        {' '}
                        <CodeIcon className={classes.iconSpacing} />
                      </Button>
                    )}
                </CardActions>
              </Card>
            </Box>
            <Box style={{ marginTop: '16px' }}>
              <Typography
                variant="h4"
                component="h2"
              >
                Compliance Activities
              </Typography>
              <Divider variant="fullWidth" />
            </Box>
            <Card>
              <CardContent>
                <ul className={classes.listSpacing}>
                  <li>
                    <Typography gutterBottom><strong>Service Base URL List Availability:</strong></Typography>
                    {' '}
                    The Service Base URL List Report provides information on the public availability of Service Base URL Lists for certified Health IT Modules. For more details, visit
                    {' '}
                    <ChplLink
                      href="https://www.healthit.gov/topic/certification-ehrs/program-resources/api-service-base-url-availability"
                      text="API Service Base URL Availability"
                      analytics={{
                        ...analytics,
                        event: 'Go to API Service Base URL Availability',
                      }}
                      external={false}
                      inline
                    />
                    .
                  </li>
                  <li>
                    <Typography gutterBottom><strong>Surveillance Activity:</strong></Typography>
                    {' '}
                    Entire collection of surveillance activity reported to the CHPL.
                  </li>
                  { hasAnyRole(['chpl-admin', 'chpl-onc'])
                    && (
                      <li>
                        <Typography gutterBottom><strong>Surveillance (Basic):</strong></Typography>
                        {' '}
                        Entire collection of surveillance activity reported to the CHPL, with only basic details about non-conformities. Includes statistics on timeframes related to discovered non-conformities.
                      </li>
                    )}
                  <li>
                    <Typography gutterBottom><strong>Surveillance Non-Conformities:</strong></Typography>
                    {' '}
                    Collection of surveillance activities that resulted in a non-conformity. This is a subset of the data available in the above &quot;Surveillance Activity&quot; file.
                  </li>
                  <li>
                    <Typography gutterBottom><strong>Direct Review Activity:</strong></Typography>
                    {' '}
                    Entire collection of Direct Review activity reported to the CHPL.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </ChplPageBody>
    </>
  );
}

export default ChplResourcesDownload;
