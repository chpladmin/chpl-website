import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  MenuItem,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';

import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper';
import { ChplTextField } from '../../../components/util';

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
  iconSpacing: {
    marginLeft: '4px',
  },
  listSpacing: {
    '& li': {
      marginBottom: '.35em',
      lineHeight: '1.3em',
    },
  },
});

function ChplResourcesDownload() {
  const $analytics = getAngularService('$analytics');
  const API = getAngularService('API');
  const {
    getApiKey,
    getToken,
    hasAnyRole,
  } = getAngularService('authService');
  const [files, setFiles] = useState({});
  const [downloadOptions, setDownloadOptions] = useState([
    '2015 edition products (xml)',
    '2014 edition products (xml)',
    '2011 edition products (xml)',
    '2015 edition summary (csv)',
    '2014 edition summary (csv)',
    'Surveillance Activity',
    'Surveillance Non-Conformities',
    'Direct Review Activity',
  ]);
  const [selectedOption, setSelectedOption] = useState('2015 edition products (xml)');
  const classes = useStyles();

  useEffect(() => {
    const data = {
      '2011 edition products (xml)': { data: `${API}/download?api_key=${getApiKey()}&edition=2011`, definition: `${API}/download?api_key=${getApiKey()}&edition=2011&definition=true`, label: '2011 XML' },
      '2014 edition products (xml)': { data: `${API}/download?api_key=${getApiKey()}&edition=2014`, definition: `${API}/download?api_key=${getApiKey()}&edition=2014&definition=true`, label: '2014 XML' },
      '2014 edition summary (csv)': { data: `${API}/download?api_key=${getApiKey()}&edition=2014&format=csv`, definition: `${API}/download?api_key=${getApiKey()}&edition=2014&format=csv&definition=true`, label: '2014 CSV' },
      '2015 edition products (xml)': { data: `${API}/download?api_key=${getApiKey()}&edition=2015`, definition: `${API}/download?api_key=${getApiKey()}&edition=2015&definition=true`, label: '2015 XML' },
      '2015 edition summary (csv)': { data: `${API}/download?api_key=${getApiKey()}&edition=2015&format=csv`, definition: `${API}/download?api_key=${getApiKey()}&edition=2015&format=csv&definition=true`, label: '2015 CSV' },
      'Direct Review Activity': { data: `${API}/developers/direct-reviews/download?api_key=${getApiKey()}`, definition: `${API}/developers/direct-reviews/download?api_key=${getApiKey()}&definition=true`, label: 'Direct Review Activity' },
      'Surveillance (Basic)': { data: `${API}/surveillance/download?api_key=${getApiKey()}&type=basic&authorization=Bearer%20${getToken()}`, definition: `${API}/surveillance/download?api_key=${getApiKey()}&type=basic&definition=true&authorization=Bearer%20${getToken()}`, label: 'Surveillance (Basic)' },
      'Surveillance Activity': { data: `${API}/surveillance/download?api_key=${getApiKey()}&type=all`, definition: `${API}/surveillance/download?api_key=${getApiKey()}&type=all&definition=true`, label: 'Surveillance' },
      'Surveillance Non-Conformities': { data: `${API}/surveillance/download?api_key=${getApiKey()}`, definition: `${API}/surveillance/download?api_key=${getApiKey()}&definition=true`, label: 'Surveillance Non-Conformities' },
      'SVAP Summary (csv)': { data: `${API}/svap/download?api_key=${getApiKey()}&type=basic&authorization=Bearer%20${getToken()}`, definition: `${API}/svap/download?api_key=${getApiKey()}&type=basic&definition=true&authorization=Bearer%20${getToken()}`, label: 'SVAP Summary' },
    };
    setFiles(data);
    setDownloadOptions((options) => {
      if (hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
        options.splice(6, 0, 'Surveillance (Basic)');
      }
      if (hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'])) {
        options.splice(5, 0, 'SVAP Summary (csv)');
      }
      return options;
    });
  }, [API, downloadOptions, getApiKey, getToken, hasAnyRole]);

  const downloadFile = (type) => {
    if (selectedOption) {
      $analytics.eventTrack(`Download CHPL${type === 'definition' ? ' Definition' : ''}`, { category: 'Download CHPL', label: files[selectedOption].label });
      window.open(files[selectedOption][type]);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.pageHeader}>
        <Typography
          variant="h1"
        >
          Download the CHPL
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography
          variant="h2"
        >
          Download the latest Certified Health IT Product List
        </Typography>
        <Divider />
        <div className={classes.content}>
          <div>
            <Typography
              variant="h6"
              gutterBottom
            >
              To download a list of certified health IT products or compliance activities listed on the CHPL, please select from one of the categories below in the dropdown menu, and then click the Data File or Definition File button as needed.
            </Typography>
            <ul className={classes.listSpacing}>
              <li>
                <Typography gutterBottom variant="subtitle1">Certified Health IT Products</Typography>
                <ul>
                  <li>
                    <strong>2015/2014/2011 Edition Products:</strong>
                    {' '}
                    Entire collection of a specified certification edition&apos;s certified products, including all data elements. Available as an XML file.
                    <ul>
                      <li>
                        The 2015 Edition Products file is updated nightly.
                      </li>
                      <li>
                        The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>2015/2014 Edition Summary:</strong>
                    {' '}
                    Entire collection of a specified certification edition&apos;s certified products, with only a subset of data elements included. Data elements included are: Certification edition, CHPL ID, ONC-ACB Certification ID, Certification Date, ONC-ACB Name, Developer Name, Product Name, Version, Practice Type (only for 2014 Edition products), Certification Status, Previous Certifying ACB, Total Number of Corrective Action Plans Over Time, Count of Currently Open Corrective Action Plans, and Certification Criteria to which that Certified Product attests. Available as a CSV file.
                    <ul>
                      <li>
                        The 2015 Edition Summary file is updated nightly.
                      </li>
                      <li>
                        The 2014 Edition Summary file is updated quarterly.
                      </li>
                    </ul>
                  </li>
                  { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'])
                    && (
                      <li>
                        <strong>Standards Version Advancement Process (SVAP) Summary:</strong>
                        {' '}
                        Entire collection of all SVAP values that have been associated with a criterion for a certified product. Available as a CSV file; updated nightly.
                      </li>
                    )}
                </ul>
              </li>
              <li>
                <Typography gutterBottom variant="subtitle1">Compliance Activities</Typography>
                <ul>
                  <li>
                    <strong>Surveillance Activity:</strong>
                    {' '}
                    Entire collection of surveillance activity reported to the CHPL. Available as a CSV file.
                  </li>
                  { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
                    && (
                      <li>
                        <strong>Surveillance (Basic):</strong>
                        {' '}
                        Entire collection of surveillance activity reported to the CHPL, with only basic details about non-conformities. Includes statistics on timeframes related to discovered non-conformities. Available as a CSV file.
                      </li>
                    )}
                  <li>
                    <strong>Surveillance Non-Conformities:</strong>
                    {' '}
                    Collection of surveillance activities that resulted in a non-conformity. This is a subset of the data available in the above &quot;Surveillance Activity&quot; file. Available as a CSV file.
                  </li>
                  <li>
                    <strong>Direct Review Activity:</strong>
                    {' '}
                    Entire collection of Direct Review activity reported to the CHPL. Available as a CSV file.
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <Card>
            <CardHeader title="Select A File To Download" />
            <CardContent>
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
              <div className={classes.fullWidth}>
                <div>
                  <Typography variant="body1">
                    The XML definition files were last modified on November 1, 2021.
                  </Typography>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <Button
                fullWidth
                color="primary"
                variant="contained"
                id="download-chpl-data-button"
                onClick={() => downloadFile('data')}
              >
                Data File
                {' '}
                <GetAppIcon className={classes.iconSpacing} />
              </Button>
              <Button
                fullWidth
                color="secondary"
                variant="contained"
                id="download-chpl-definition-button"
                onClick={() => downloadFile('definition')}
              >
                Definition File
                {' '}
                <GetAppIcon className={classes.iconSpacing} />
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ChplResourcesDownload;
