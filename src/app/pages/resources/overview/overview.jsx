import React, { useEffect, useState } from 'react';
import {
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import { useFetchAcbs } from 'api/acbs';
import { useFetchAnnouncements } from 'api/announcements';
import { useFetchAtls } from 'api/atls';
import ApiWrapper from 'api/api-wrapper';
import {
  ChplLink,
  InternalScrollButton,
} from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import theme from 'themes/theme';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    overflowWrap: 'anywhere',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  pageBody: {
    display: 'grid',
    gap: '32px',
    gridTemplateColumns: '1fr',
    padding: '32px',
    backgroundColor: '#f9f9f9',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto 1fr',
    },
  },
  pageNavigation: {
    position: 'sticky',
    top: 0,
    height: 'min-content',
    display: 'grid',
    gap: '8px',
    backgroundColor: '#f9f9f9',
    justifyItems: 'start',
    borderBottom: '1px solid #c2c6ca',
    paddingBottom: '16px',
    [theme.breakpoints.up('md')]: {
      top: '100px',
      borderRight: '1px solid #c2c6ca',
      borderBottom: 'none',
      paddingRight: '16px',
    },
  },
  pageHeader: {
    padding: '32px',
  },
});

const getOrgs = (query, key) => {
  if (!query.isSuccess) { return []; }
  return query.data[key]
    .filter((item) => !item.retired)
    .sort((a, b) => (a.name < b.name ? -1 : 1));
};

function ChplResourcesOverview() {
  const DateUtil = getAngularService('DateUtil');
  const { data, isLoading, isSuccess } = useFetchAnnouncements({ getFuture: false });
  const acbQuery = useFetchAcbs();
  const atlQuery = useFetchAtls();
  const [announcements, setAnnouncements] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setAnnouncements(data.sort((a, b) => a.startDate - b.startDate));
  }, [data, isLoading, isSuccess, DateUtil]);

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
        <div className={classes.pageNavigation}>
          {announcements.length > 0
           && (
             <InternalScrollButton
               id="announcements"
               analytics={{ event: 'Jump to Overview Section', category: 'Navigation', label: 'Announcements' }}
             >
               Announcements
               <ArrowForwardIcon className={classes.iconSpacing} />
             </InternalScrollButton>
           )}
          <InternalScrollButton
            id="whatIsTheChpl"
            analytics={{ event: 'Jump to Overview Section', category: 'Navigation', label: 'What is the CHPL' }}
          >
            What is the CHPL
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <InternalScrollButton
            id="recommendedWebBrowsers"
            analytics={{ event: 'Jump to Overview Section', category: 'Navigation', label: 'Recommended Web Browsers' }}
          >
            Recommended Web Browsers
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <InternalScrollButton
            id="usingTheChplWebsite"
            analytics={{ event: 'Jump to Overview Section', category: 'Navigation', label: 'Using the CHPL Website' }}
          >
            Using the Chpl Website
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <InternalScrollButton
            id="oncCertificationProgram"
            analytics={{ event: 'Jump to Overview Section', category: 'Navigation', label: 'ONC Certification Program' }}
          >
            ONC Certification Program
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <InternalScrollButton
            id="forEhrDevelopers"
            analytics={{ event: 'Jump to Overview Section', category: 'Navigation', label: 'For EHR Developers' }}
          >
            For EHR Developers
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
          <InternalScrollButton
            id="oncacbAndAtlInformation"
            analytics={{ event: 'Jump to Overview Section', category: 'Navigation', label: 'ONC-ACB and ONC-ATL information' }}
          >
            ONC-ACB and ONC-ATL Information
            <ArrowForwardIcon className={classes.iconSpacing} />
          </InternalScrollButton>
        </div>
        <div className={classes.content}>
          {announcements.length > 0
           && (
             <>
               <span className="anchor-element">
                 <span id="announcements" className="page-anchor" />
               </span>
               <Typography variant="h2">
                 Announcement
                 {announcements.length > 1 ? 's' : ''}
               </Typography>
               <ul>
                 {announcements.map((announcement) => (
                   <li key={announcement.id}>
                     <strong>{announcement.title}</strong>
                     {announcement.text
                      && (
                        <>
                          :
                          {' '}
                          {announcement.text}
                        </>
                      )}
                   </li>
                 ))}
               </ul>
             </>
           )}
          <span className="anchor-element">
            <span id="whatIsTheChpl" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            What is the CHPL?
          </Typography>
          <Typography gutterBottom>
            The Certified Health IT Product List (CHPL) is a comprehensive and authoritative listing of all certified health information technology that have been successfully tested and certified by the ONC Health IT Certification program. All products listed on the CHPL have been tested by an ONC-Authorized Testing Laboratory (ONC-ATL) and certified by an ONC-Authorized Certification Body (ONC-ACB) to meet criteria adopted by the Secretary of the Department of Health and Human Services (HHS).
          </Typography>
          <Typography gutterBottom>
            For additional information on how to navigate the CHPL, please refer to the
            {' '}
            <ChplLink
              href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf"
              text="CHPL Public User Guide"
              analytics={{ event: 'CHPL Public User Guide', category: 'Resources' }}
              external={false}
            />
          </Typography>
          <Typography gutterBottom>
            For more information on attesting for Promoting Interoperability under the Centers for Medicare &amp; Medicaid Services (CMS), please see the
            {' '}
            <a href="https://www.cms.gov/regulations-and-guidance/legislation/ehrincentiveprograms/registrationandattestation.html">CMS Promoting Interoperability Programs Registration &amp; Attestation Page</a>
            .
          </Typography>
          <Divider />
          <span className="anchor-element">
            <span id="recommendedWebBrowsers" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            Recommended Web Browsers
          </Typography>
          <Typography gutterBottom>
            The CHPL website supports the following web browsers:
          </Typography>
          <ul>
            <li>Google Chrome (latest version) [preferred]</li>
            <li>Apple Safari (two most recent major versions)</li>
            <li>Microsoft Edge (two most recent major versions)</li>
            <li>Mozilla Firefox (latest version)</li>
          </ul>
          <Divider />
          <span className="anchor-element">
            <span id="usingTheChplWebsite" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            Using the CHPL Website
          </Typography>
          <Typography variant="h3">
            How do I use the CHPL to view certified health information technology?
          </Typography>
          <Typography gutterBottom>
            To search for certified health information technology, type a developer name, product name, CHPL Product ID, or ONC-ACB Certification ID into the main search area. Alternatively, you may choose to browse all certified products by clicking the &apos;Browse all&apos; option. Filters are also available to search for product listings matching specific criteria (e.g., certification criteria, clinical quality measurements, etc.). The CHPL will display your search results based on the information entered.
          </Typography>
          <Typography variant="h3">
            How do I create a CMS EHR Certification ID?
          </Typography>
          <Typography gutterBottom>
            To create a CMS EHR Certification ID, search for the products that you would like to use your CMS Certification ID. Once you have located the product listings you would like to use, click the yellow &quot;+CertID&quot; button to the right of the product listing on the search results page to add to the &apos;CMS ID Creator&apos; widget at the top of the page. Once you have entered all of the desired product listings, you will be able to generate a CMS EHR Certification ID by clicking the &apos;Get EHR Certification ID&apos; button, if the combination of product listings selected meets the program requirements.
          </Typography>
          <Typography variant="h3">
            What is the difference between an ONC-ACB Certification ID and CHPL Product Number (CHPL ID)?
          </Typography>
          <Typography gutterBottom>
            CHPL IDs are unique to each certified product. There are two types of CHPL IDs depending on the certified product. Certified products from the CHPL 4.0 (those certified before March 28, 2016) have CHPL IDs in the following format:
            {' '}
            <code>CHP-XXXXXX</code>
            {' '}
            (e.g.,
            {' '}
            <code>CHP-022989</code>
            ). Products certified for the first time on the new &quot;open data&quot; CHPL (those certified after March 28, 2016) have CHPL IDs in the following format:
            {' '}
            <code>Edition . ATL . ACB . Developer . Product . Version . ICS . ReliedUponSoftware . Date</code>
            {' '}
            (e.g.,
            {' '}
            <code>15.04.04.1064.Alls.AM.0.1.160804</code>
            ).
          </Typography>
          <Typography gutterBottom>
            ONC-ACB Certification IDs are generated by each ONC-ACB and may not have a consistent format. In addition, a single ONC-ACB Certification ID may reference more than one certified product.
          </Typography>
          <Typography variant="h3">
            How do I compare products?
          </Typography>
          <Typography gutterBottom>
            To compare product listings, please navigate to the product listings you would like to compare and use the green &apos;+Compare&apos; button to the right of the product listing information on the search results page or in the upper right-hand corner of the product listing detail page to add the product listings to the &apos;Compare&apos; module. Once you have identified all the product listings you would like to compare, click the blue &apos;Compare Products&apos; button in the module (pops out once at least one product listing is selected) to view the products side-by-side.
          </Typography>
          <Typography variant="h3">
            How would I report a problem or concern with my certified health information technology?
          </Typography>
          <Typography gutterBottom>
            Errors or questions regarding product listings should be directed based on the table below. A list of ONC-ACB contact information can be found on ONC&apos;s
            {' '}
            <a href="https://www.healthit.gov/topic/certification-ehrs/certification-process">Certification Bodies</a>
            {' '}
            and
            {' '}
            <a href="https://www.healthit.gov/topic/certification-ehrs/testing-process-test-methods">Testing Laboratories</a>
            {' '}
            pages.
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell scope="col">Issue</TableCell>
                <TableCell scope="col">Contact</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Eligible Professionals &amp; Eligible Hospital complaints regarding an EHR product</TableCell>
                <TableCell>
                  Please refer to the ONC Health IT Certification Program&apos;s
                  {' '}
                  <a href="https://www.healthit.gov/topic/certified-health-it-complaint-process">Provider Complaint Process</a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Developer complaint against an ONC-ATL or ONC-ACB</TableCell>
                <TableCell>Please contact the ONC-ATL or ONC-ACB first to resolve the issue. Complaints should be escalated to NVLAP or the ONC-AA if the issue persists.</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Product Listing on the CHPL</TableCell>
                <TableCell>Please contact the ONC-ATL or ONC-ACB that certified the product</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Other comments or complaints</TableCell>
                <TableCell>
                  Please use
                  {' '}
                  <a href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51">ONC&apos;s Health IT Feedback Form</a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <br />
          <Typography gutterBottom>
            If the ONC-ACB cannot or does not address your issue, please use
            {' '}
            <a href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51">ONC&apos;s Health IT Feedback Form</a>
            .
          </Typography>
          <Divider />
          <span className="anchor-element">
            <span id="oncCertificationProgram" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            ONC Certification Program
          </Typography>
          <Typography gutterBottom variant="h3">
            How does the certification process work?
          </Typography>
          <Typography gutterBottom>
            The ONC Certification Program was established to ensure that certified health information technology adheres to the security, functionality, and technology requirements adopted by HHS. ONC-Authorized Certification Bodies (ONC-ACBs) certify health IT products that were successfully tested by an ONC-Authorized Testing Laboratory (ONC-ATL) against the certification criteria adopted by HHS. Products listed on the CHPL have been successfully certified through the
            {' '}
            <a href="http://www.healthit.gov/policy-researchers-implementers/about-onc-health-it-certification-program">ONC Health IT Certification Program</a>
            {' '}
            by an ONC-ACB.
          </Typography>
          <Typography gutterBottom>
            Certification criteria establish the required capabilities, standards, and implementation specifications that health information technology needs to meet in order to become certified under the ONC Health IT Certification Program. Certified health IT products can be used for participation in CMS quality reporting programs and State Promoting Interoperability Programs.
          </Typography>
          <Typography gutterBottom variant="h3">
            Which Certification Edition do I need to use to attest for Promoting Interoperability Programs?
          </Typography>
          <Typography gutterBottom>
            For more information on attesting to Promoting Interoperability, please refer to the
            {' '}
            <a href="https://www.cms.gov/regulations-and-guidance/legislation/ehrincentiveprograms/registrationandattestation.html">CMS Promoting Interoperability Programs Registration and Attestation Page</a>
            .
          </Typography>
          <Typography gutterBottom variant="h3">
            What are clinical quality measures (CQMs)?
          </Typography>
          <Typography gutterBottom>
            Clinical quality measures (CQMs) are used to measure and track the quality of healthcare services delivered by eligible professionals, eligible hospitals, and critical access hospitals.
          </Typography>
          <Typography gutterBottom>
            For more information, please see the
            {' '}
            <a href="https://www.cms.gov/regulations-and-guidance/legislation/ehrincentiveprograms/clinicalqualitymeasures.html">CMS Clinical Quality Measures Basics page</a>
            .
          </Typography>
          <Typography gutterBottom variant="h3">
            What are electronic clinical quality measures (eCQMs)?
          </Typography>
          <Typography gutterBottom>
            eCQMs use data from electronic health records (EHR) and/or health information technology systems to measure health care quality. CMS, along with other HHS agencies, use eCQMs in a variety of quality reporting and incentive programs. For more information on eCQMs, please visit the
            {' '}
            <a href="https://ecqi.healthit.gov/">eCQI Resource Center</a>
            .
          </Typography>
          <Divider />
          <span className="anchor-element">
            <span id="forEhrDevelopers" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            For EHR Developers
          </Typography>
          <Typography gutterBottom variant="h3">
            How can a product be added to the CHPL?
          </Typography>
          <Typography gutterBottom>
            To be listed on the CHPL, health information technology must first be successfully tested by an ONC-ATL and then certified by an ONC-ACB against at least one
            {' '}
            <a href="http://www.healthit.gov/policy-researchers-implementers/standards-and-certification-regulations">certification criterion adopted by HHS</a>
            . For more information on the ONC Certification Program, ONC-ATLs, and ONC-ACBs, please see the
            {' '}
            <a href="http://www.healthit.gov/policy-researchers-implementers/about-onc-health-it-certification-program">ONC Health IT Certification Program page</a>
            .
          </Typography>
          <Divider />
          <span className="anchor-element">
            <span id="oncacbAndAtlInformation" className="page-anchor" />
          </span>
          <Typography gutterBottom variant="h2">
            ONC-ACB and ONC-ATL Information
          </Typography>
          <Typography gutterBottom>
            The following table identifies the ONC-ACBs and ONC-ATLs used to certify and test health information technology presented on the CHPL. For more information, please visit their respective websites.
          </Typography>
          <Table id="acbAtlTable">
            <TableHead>
              <TableRow>
                <TableCell scope="col">Body</TableCell>
                <TableCell scope="col">Name</TableCell>
                <TableCell scope="col">Code</TableCell>
                <TableCell scope="col">Website</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getOrgs(acbQuery, 'acbs').map((acb) => (
                <TableRow key={acb.id}>
                  <TableCell>ONC-ACB</TableCell>
                  <TableCell>{acb.name}</TableCell>
                  <TableCell>{acb.acbCode}</TableCell>
                  <TableCell>
                    {acb.website
                      && <ChplLink href={acb.website} />}
                  </TableCell>
                </TableRow>
              ))}
              {getOrgs(atlQuery, 'atls').map((atl) => (
                <TableRow key={atl.id}>
                  <TableCell>ONC-ATL</TableCell>
                  <TableCell>{atl.name}</TableCell>
                  <TableCell>{atl.atlCode}</TableCell>
                  <TableCell>
                    {atl.website
                      && <ChplLink href={atl.website} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default function OverviewWrapper() {
  return (
    <ApiWrapper>
      <ChplResourcesOverview />
    </ApiWrapper>
  );
}
