import React, { useEffect, useState } from 'react';
import {
  Divider,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SwaggerUI from 'swagger-ui-react';

import theme from '../../../themes/theme';
import ScrollingNavigationLink from './scrolling-navigation-link';
import { ChplLink } from '../../../components/util';
import { getAngularService } from '../../../services/angular-react-helper';

const useStyles = makeStyles({
  pageHeader: {
    padding: '32px',
  },
  pageBody: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr 4fr',
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

function ChplResourcesOverview() {
  const networkService = getAngularService('networkService');
  const [acbs] = useState([]);
  const [atls] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    // get acb & atl data;
  }, [networkService]);

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.pageHeader}>
        <Typography
          variant="h1"
        >
          CHPL Overview
        </Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <div>
          <ul>
            <li>
              <a href="#{{ $ctrl.currentPage }}#whatIsTheChpl" analytics-on="click" analytics-event="Jump to Overview Section" analytics-properties="{ category: 'Navigation', label: 'What is the CHPL' }">What is the CHPL</a>
            </li>
            <li>
              <a href="#{{ $ctrl.currentPage }}#recommendedWebBrowsers" analytics-on="click" analytics-event="Jump to Overview Section" analytics-properties="{ category: 'Navigation', label: 'Recommended Web Browsers' }">Recommended Web Browsers</a>
            </li>
            <li>
              <a href="#{{ $ctrl.currentPage }}#usingTheChplWebsite" analytics-on="click" analytics-event="Jump to Overview Section" analytics-properties="{ category: 'Navigation', label: 'Using the CHPL Website' }">Using the CHPL Website</a>
            </li>
            <li>
              <a href="#{{ $ctrl.currentPage }}#oncCertificationProgram" analytics-on="click" analytics-event="Jump to Overview Section" analytics-properties="{ category: 'Navigation', label: 'ONC Certification Program' }">ONC Certification Program</a>
            </li>
            <li>
              <a href="#{{ $ctrl.currentPage }}#forEhrDevelopers" analytics-on="click" analytics-event="Jump to Overview Section" analytics-properties="{ category: 'Navigation', label: 'For EHR Developers' }">For EHR Developers</a>
            </li>
            <li>
              <a href="#{{ $ctrl.currentPage }}#oncacbAndAtlInformation" analytics-on="click" analytics-event="Jump to Overview Section" analytics-properties="{ category: 'Navigation', label: 'ONC-ACB and ONC-ATL information' }">ONC-ACB and ONC-ATL information</a>
            </li>
          </ul>
        </div>
        <div>
          <span className="anchor-element">
            <a id="whatIsTheChpl" className="page-anchor"></a>
          </span>
          <Typography
            variant="h2"
          >
            What is the CHPL?
          </Typography>
          <Typography gutterBottom>
            The Certified Health IT Product List (CHPL) is a comprehensive and authoritative listing of all certified health information technology that have been successfully tested and certified by the ONC Health IT Certification program. All products listed on the CHPL have been tested by an ONC-Authorized Testing Laboratory (ONC-ATL) and certified by an ONC-Authorized Certification Body (ONC-ACB) to meet criteria adopted by the Secretary of the Department of Health and Human Services (HHS).
          </Typography>
          <Typography gutterBottom>
            For additional information on how to navigate the CHPL, please refer to the <a href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf" analytics-on="click" analytics-event="CHPL Public User Guide" analytics-properties="{ category: 'Resources', label: '' }">CHPL Public User Guide</a>
          </Typography>
          <Typography gutterBottom>
            For more information on attesting for Promoting Interoperability under the Centers for Medicare &amp; Medicaid Services (CMS), please see the <a href="https://www.cms.gov/regulations-and-guidance/legislation/ehrincentiveprograms/registrationandattestation.html">CMS Promoting Interoperability Programs Registration &amp; Attestation Page</a>.
          </Typography>
          <ScrollingNavigationLink
            name="Back to the top"
            id="whatIsTheChpl"
          />
          <Divider />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default ChplResourcesOverview;
