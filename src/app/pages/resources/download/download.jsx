import React, { useEffect } from 'react';
import {
  Button,
  Container,
  Paper,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px 8px',
  },
  downloadCollection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px 8px',
  },
  fullWidth: {
    gridColumnEnd: 'span 2',
  },
});

function ChplResourcesDownload() {
  const classes = useStyles();
  const showRestricted = false;

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Paper>
          <Typography
            variant="h1"
          >
            Download the CHPL
          </Typography>
          <div className="main-content" id="main-content" tabIndex="-1">
            <Typography
              variant="h2"
            >
              Download the latest Certified Health IT Product List
            </Typography>
            <div className={classes.container}>
              <div>
                <Typography
                  variant="body1"
                >
                  To download a list of certified health IT products or compliance activities listed on the CHPL, please select from one of the categories below in the dropdown menu, and then click the Data File or Definition File button as needed.
                </Typography>
                <ul>
                  <li>Certified Health IT Products
                    <ul>
                      <li><strong>2015/2014/2011 Edition Products:</strong> Entire collection of a specified certification edition's certified products, including all data elements. Available as an XML file.
                        <ul>
                          <li>The 2015 Edition Products file is updated nightly.</li>
                          <li>The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.</li>
                        </ul>
                      </li>
                      <li><strong>2015/2014 Edition Summary:</strong> Entire collection of a specified certification edition's certified products, with only a subset of data elements included. Data elements included are: Certification edition, CHPL ID, ONC-ACB Certification ID, Certification Date, ONC-ACB Name, Developer Name, Product Name, Version, Practice Type (only for 2014 Edition products), Certification Status, Previous Certifying ACB, Total Number of Corrective Action Plans Over Time, Count of Currently Open Corrective Action Plans, and Certification Criteria to which that Certified Product attests. Available as a CSV file.
                        <ul>
                          <li>The 2015 Edition Summary file is updated nightly.</li>
                          <li>The 2014 Edition Summary file is updated quarterly.</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>Compliance Activities
                    <ul>
                      <li><strong>Surveillance Activity:</strong> Entire collection of surveillance activity reported to the CHPL. Available as a CSV file.</li>
                      { showRestricted &&
                        <li><strong>Surveillance (Basic):</strong> Entire collection of surveillance activity reported to the CHPL, with only basic details about non-conformities. Includes statistics on timeframes related to discovered non-conformities. Available as a CSV file.</li>
                      }
                      <li><strong>Surveillance Non-Conformities:</strong> Collection of surveillance activities that resulted in a non-conformity. This is a subset of the data available in the above "Surveillance Activity" file. Available as a CSV file.</li>
                      <li><strong>Direct Review Activity:</strong> Entire collection of Direct Review activity reported to the CHPL. Available as a CSV file.</li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div className={classes.downloadCollection}>
                <div className={classes.fullWidth}>
                  Pick a thing here (select box)
                </div>
                <div>
                  <Button>Data File</Button>
                </div>
                <div>
                  <Button>Definition File</Button>
                </div>
                <div className={classes.fullWidth}>
                  <div>
                    <small>The XML definition files were last modified on August 2, 2021.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default ChplResourcesDownload;
