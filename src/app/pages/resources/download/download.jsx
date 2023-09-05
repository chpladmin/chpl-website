import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import GetAppIcon from '@material-ui/icons/GetApp';
import ReportProblemOutlinedIcon from '@material-ui/icons/ReportProblemOutlined';

import { ChplLink, ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  pageHeader: {
    padding: '32px',
  },
  pageBody: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    padding: '32px',
    backgroundColor: palette.background,
  },
  content: {
    display: 'grid',
    gap: '64px',
    alignItems: 'start',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  listSpacing: {
    '& li': {
      lineHeight: '1.3em',
      marginBottom: '.7em',
      marginTop: '.7em',
    },
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
  listHeaders: {
    marginBottom: '8px',
  },
});

const allOptions = [
  '2015 edition products (json)',
  '2014 edition products (json)',
  '2011 edition products (json)',
  '2015 edition products (xml)',
  '2014 edition products (xml)',
  '2011 edition products (xml)',
  '2015 edition summary (csv)',
  '2014 edition summary (csv)',
  'SVAP Summary (csv)',
  'Surveillance Activity',
  'Surveillance (Basic)',
  'Surveillance Non-Conformities',
  'Direct Review Activity',
];

function ChplResourcesDownload() {
  const $analytics = getAngularService('$analytics');
  const API = getAngularService('API');
  const {
    getApiKey,
    getToken,
  } = getAngularService('authService');
  const { hasAnyRole } = useContext(UserContext);
  const [files, setFiles] = useState({});
  const [downloadOptions, setDownloadOptions] = useState(allOptions);
  const [selectedOption, setSelectedOption] = useState('2015 edition products (json)');
  const classes = useStyles();

  useEffect(() => {
    const data = {
      '2015 edition products (json)': { data: `${API}/download?api_key=${getApiKey()}&edition=2015&format=json`, definition: '', label: '2015 JSON' },
      '2014 edition products (json)': { data: `${API}/download?api_key=${getApiKey()}&edition=2014&format=json`, definition: '', label: '2014 JSON' },
      '2011 edition products (json)': { data: `${API}/download?api_key=${getApiKey()}&edition=2011&format=json`, definition: '', label: '2011 JSON' },
      '2015 edition products (xml)': { data: `${API}/download?api_key=${getApiKey()}&edition=2015`, definition: `${API}/download?api_key=${getApiKey()}&edition=2015&definition=true`, label: '2015 XML' },
      '2014 edition products (xml)': { data: `${API}/download?api_key=${getApiKey()}&edition=2014`, definition: `${API}/download?api_key=${getApiKey()}&edition=2014&definition=true`, label: '2014 XML' },
      '2011 edition products (xml)': { data: `${API}/download?api_key=${getApiKey()}&edition=2011`, definition: `${API}/download?api_key=${getApiKey()}&edition=2011&definition=true`, label: '2011 XML' },
      '2015 edition summary (csv)': { data: `${API}/download?api_key=${getApiKey()}&edition=2015&format=csv`, definition: `${API}/download?api_key=${getApiKey()}&edition=2015&format=csv&definition=true`, label: '2015 CSV' },
      '2014 edition summary (csv)': { data: `${API}/download?api_key=${getApiKey()}&edition=2014&format=csv`, definition: `${API}/download?api_key=${getApiKey()}&edition=2014&format=csv&definition=true`, label: '2014 CSV' },
      'SVAP Summary (csv)': { data: `${API}/svap/download?api_key=${getApiKey()}`, definition: `${API}/svap/download?api_key=${getApiKey()}&definition=true`, label: 'SVAP Summary' },
      'Surveillance (Basic)': { data: `${API}/surveillance/download?api_key=${getApiKey()}&type=basic&authorization=Bearer%20${getToken()}`, definition: `${API}/surveillance/download?api_key=${getApiKey()}&type=basic&definition=true&authorization=Bearer%20${getToken()}`, label: 'Surveillance (Basic)' },
      'Surveillance Activity': { data: `${API}/surveillance/download?api_key=${getApiKey()}&type=all`, definition: `${API}/surveillance/download?api_key=${getApiKey()}&type=all&definition=true`, label: 'Surveillance' },
      'Surveillance Non-Conformities': { data: `${API}/surveillance/download?api_key=${getApiKey()}`, definition: `${API}/surveillance/download?api_key=${getApiKey()}&definition=true`, label: 'Surveillance Non-Conformities' },
      'Direct Review Activity': { data: `${API}/developers/direct-reviews/download?api_key=${getApiKey()}`, definition: `${API}/developers/direct-reviews/download?api_key=${getApiKey()}&definition=true`, label: 'Direct Review Activity' },
    };
    setFiles(data);
    setDownloadOptions(() => allOptions.filter((option) => {
      if (option === 'Surveillance (Basic)' && !hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
        return false;
      }
      return true;
    }));
  }, [API, getApiKey, getToken, hasAnyRole]);

  const downloadFile = (type) => {
    if (selectedOption) {
      $analytics.eventTrack(`Download CHPL${type === 'definition' ? ' Definition' : ''}`, { category: 'Download CHPL', label: files[selectedOption].label });
      window.open(files[selectedOption][type]);
    }
  };

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography
          variant="h1"
        >
          Download the Latest Certified Health IT Product List
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography
          variant="body1"
        >
          Please note that the CHPL files are now available in JSON format, offering a more modern and flexible approach to data integration. Please note that while our XML files are still available, they are being deprecated and will be discontinued in the near future. We recommend transitioning to JSON format for future-proofing your data integrations.
        </Typography>
        <Divider />
        <div className={classes.content}>
          <div>
            <Typography
              variant="h4"
              component="h3"
              gutterBottom
            >
              <strong>Definitions & Guidelines</strong>
            </Typography>
            <Typography className={classes.listHeaders} gutterBottom variant="h6"><strong>Certified Health IT Products</strong></Typography>
            <ul className={classes.listSpacing}>
              <li>
                <Typography gutterBottom><strong>2015/2014/2011 Edition Products (JSON):</strong></Typography>
                {' '}
                Entire collection of a specified certification edition&apos;s certified products, including all data elements.
                <ul>
                  <li>
                    The 2015 Edition Products file is updated nightly.
                  </li>
                  <li>
                    The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.
                  </li>
                  <li>
                    For more information, please look at the
                    {' '}
                    <ChplLink
                      href="#/resources/api"
                      text="API Documentation page"
                      external={false}
                      inline
                      router={{ sref: 'resources.api' }}
                    />
                    .
                  </li>
                </ul>
              </li>
              <li>
                <Typography gutterBottom><strong>2015/2014/2011 Edition Products (XML):</strong></Typography>
                {' '}
                Entire collection of a specified certification edition&apos;s certified products, including all data elements.
                <ul>
                  <li>
                    The 2015 Edition Products file is updated nightly.
                  </li>
                  <li>
                    The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.
                  </li>
                </ul>
              </li>
              <Box className={classes.warningBox}>
                <ReportProblemOutlinedIcon />
                <Typography>
                  XML Files are being deprecated and will be discontinued in the near future.
                </Typography>
              </Box>
              <li>
                <Typography gutterBottom><strong>2015/2014 Edition Summary (CSV):</strong></Typography>
                {' '}
                Entire collection of a specified certification edition&apos;s certified products, with only a subset of data elements included. Data elements included are: Certification edition, CHPL ID, ONC-ACB Certification ID, Certification Date, ONC-ACB Name, Developer Name, Product Name, Version, Practice Type (only for 2014 Edition products), Certification Status, Previous Certifying ACB, Total Number of Corrective Action Plans Over Time, Count of Currently Open Corrective Action Plans, and Certification Criteria to which that Certified Product attests.
                <ul>
                  <li>
                    The 2015 Edition Summary file is updated nightly.
                  </li>
                  <li>
                    The 2014 Edition Summary file is updated quarterly.
                  </li>
                </ul>
              </li>
              <li>
                <Typography gutterBottom><strong>Standards Version Advancement Process (SVAP) Summary (CSV):</strong></Typography>
                {' '}
                Entire collection of SVAP values that have been associated with a criterion for a certified product. Multiple rows for a single product will appear in the file for any products containing multiple SVAP values and/or SVAP values for multiple criteria. Updated nightly.
              </li>
            </ul>
            <Box pt={4} pb={4}>
              <Divider variant="fullWidth" />
            </Box>
            <Typography className={classes.listHeaders} gutterBottom variant="h6"><strong>Compliance Activities</strong></Typography>
            <ul className={classes.listSpacing}>
              <li>
                <Typography gutterBottom><strong>Surveillance Activity (CSV):</strong></Typography>
                {' '}
                Entire collection of surveillance activity reported to the CHPL.
              </li>
              { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
                && (
                  <li>
                    <Typography gutterBottom><strong>Surveillance (Basic) (CSV):</strong></Typography>
                    {' '}
                    Entire collection of surveillance activity reported to the CHPL, with only basic details about non-conformities. Includes statistics on timeframes related to discovered non-conformities.
                  </li>
                )}
              <li>
                <Typography gutterBottom><strong>Surveillance Non-Conformities (CSV):</strong></Typography>
                {' '}
                Collection of surveillance activities that resulted in a non-conformity. This is a subset of the data available in the above &quot;Surveillance Activity&quot; file.
              </li>
              <li>
                <Typography gutterBottom><strong>Direct Review Activity (CSV):</strong></Typography>
                {' '}
                Entire collection of Direct Review activity reported to the CHPL.
              </li>
            </ul>
          </div>
          <Card elevation={4}>
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
                <div className={classes.fullWidth}>
                  <div>
                    <Typography variant="body1">
                      The XML definition files were last modified on September 5, 2023.
                    </Typography>
                  </div>
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
                Data File
                {' '}
                <GetAppIcon className={classes.iconSpacing} />
              </Button>
              <Button
                fullWidth
                color="primary"
                variant="text"
                id="download-chpl-definition-button"
                disabled={files[selectedOption]?.definition === ''}
                onClick={() => downloadFile('definition')}
              >
                Definition File
                {' '}
                <CodeIcon className={classes.iconSpacing} />
              </Button>
            </CardActions>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ChplResourcesDownload;
