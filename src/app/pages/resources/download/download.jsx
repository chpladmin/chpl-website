import React, { useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Divider,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import { getAngularService } from '../../../services/angular-react-helper';
import GetAppIcon from '@material-ui/icons/GetApp';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '32px',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'start',
  },
  fullWidth: {
    gridColumnEnd: 'span 2',
  },
  rowHeader: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    alignItems: 'start',
    padding: '32px',
    backgroundColor:'#ffffff',
    },
  rowBody: {
      display: 'grid',
      gap: '16px',
      gridTemplateColumns: '1fr',
      alignItems: 'start',
      padding: '32px',
      backgroundColor:'#f9f9f9',
      marginBottom:'-128px',
  },
  iconSpacing:{
    marginLeft:'4px',
  },
});

function ChplResourcesDownload() {
  const classes = useStyles();
  const showRestricted = false;

  return (
    <ThemeProvider theme={theme}>
        <div className={classes.rowHeader}>
          <Typography
            variant="h1"
          >
            Download the CHPL
          </Typography>
          </div>
          <div className={classes.rowBody} id="main-content" tabIndex="-1">
            <Typography
              variant="h2"
            >
              Download the latest Certified Health IT Product List
            </Typography>
            <Divider/>
            <div className={classes.content}>
              <div>
                <Typography
                  variant="h6"
                  gutterBottom
                >
                  To download a list of certified health IT products or compliance activities listed on the CHPL, please select from one of the categories below in the dropdown menu, and then click the Data File or Definition File button as needed.
                </Typography>
                <ul>
                  <li><Typography gutterBottom variant="subtitle1">Certified Health IT Products</Typography>
                    <ul>
                      <li><Typography gutterBottom variant='body1'><strong>2015/2014/2011 Edition Products:</strong>Entire collection of a specified certification edition's certified products, including all data elements. Available as an XML file.</Typography>
                        <ul>
                          <li><Typography gutterBottom variant='body1'>The 2015 Edition Products file is updated nightly.</Typography></li>
                          <li><Typography gutterBottom variant='body1'>The 2014 Edition Products file and the 2011 Edition Products file are updated quarterly.</Typography></li>
                        </ul>
                      </li>
                      <li><Typography gutterBottom variant='body1'><strong>2015/2014 Edition Summary:</strong> Entire collection of a specified certification edition's certified products, with only a subset of data elements included. Data elements included are: Certification edition, CHPL ID, ONC-ACB Certification ID, Certification Date, ONC-ACB Name, Developer Name, Product Name, Version, Practice Type (only for 2014 Edition products), Certification Status, Previous Certifying ACB, Total Number of Corrective Action Plans Over Time, Count of Currently Open Corrective Action Plans, and Certification Criteria to which that Certified Product attests. Available as a CSV file.</Typography>
                        <ul>
                          <li><Typography gutterBottom variant='body1'>The 2015 Edition Summary file is updated nightly.</Typography></li>
                          <li><Typography gutterBottom variant='body1'>The 2014 Edition Summary file is updated quarterly.</Typography></li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li><Typography gutterBottom variant='subtitle1'>Compliance Activities</Typography>
                    <ul>
                      <li><Typography gutterBottom variant='body1'><strong>Surveillance Activity:</strong> Entire collection of surveillance activity reported to the CHPL. Available as a CSV file.</Typography></li>
                      { showRestricted &&
                        <li><Typography gutterBottom variant='body1'><strong>Surveillance (Basic):</strong> Entire collection of surveillance activity reported to the CHPL, with only basic details about non-conformities. Includes statistics on timeframes related to discovered non-conformities. Available as a CSV file.</Typography></li>
                      }
                      <li><Typography gutterBottom variant='body1'><strong>Surveillance Non-Conformities:</strong> Collection of surveillance activities that resulted in a non-conformity. This is a subset of the data available in the above "Surveillance Activity" file. Available as a CSV file.</Typography></li>
                      <li><Typography gutterBottom variant='body1'><strong>Direct Review Activity:</strong> Entire collection of Direct Review activity reported to the CHPL. Available as a CSV file.</Typography></li>
                    </ul>
                  </li>
                </ul>
              </div>
                <Card>
                  <CardHeader title="Select A File To Download">
                    
                  </CardHeader>
                  <CardContent>
                    <div className={classes.fullWidth}>
                      Pick a thing here (select box)
                    </div>
                    <div className={classes.fullWidth}>
                      <div>
                        <Typography variant="body1">
                        The XML definition files were last modified on August 2, 2021.
                        </Typography>
                      </div>
                    </div>
                </CardContent>
                <CardActions>
                    <Button fullWidth color="primary" variant="contained">Data File<GetAppIcon className={classes.iconSpacing}/></Button>
                    <Button fullWidth color="secondary" variant="contained">Definition File<GetAppIcon className={classes.iconSpacing}/></Button>
                </CardActions>
              </Card>
            </div>
            </div>
    </ThemeProvider>
  );
}

export default ChplResourcesDownload;
