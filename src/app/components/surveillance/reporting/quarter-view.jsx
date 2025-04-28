import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import {
  func,
  object,
} from 'prop-types';
import {
  ArrowDropDown, ArrowUpwardRounded,
} from '@material-ui/icons';

import ChplQuarterViewListing from './quarter-view-listing';

import { useFetchRelevantListings } from 'api/surveillance';
import ChplComplaints from 'components/surveillance/complaints/complaints';
import { ChplActionBar } from 'components/action-bar';
import { getDisplayDateFormat } from 'services/date-util';
import { theme, utilStyles, palette } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  accordionSummary: {
    backgroundColor: `${palette.white} !important`,
    borderRadius: '4px',
    border: `.5px solid ${palette.divider}`,
    marginBottom: '8px',
    '&:before': {
      display: 'none',
    },
  },
  accordionSummaryContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: '8px',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    marginBottom: '32px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '350px 1fr',
      alignItems: 'start',
    },
  },
  menuItems: {
    padding: '8px',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
  reportInfoCard: {
    padding: '8px',
    marginBottom: '16px',
  },
  stickyColumn: {
    position: 'sticky',
    top: 124,
    zIndex: 1,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0 4px 8px',
  },
  summaryGroup: {
    margin: '8px 0',
    whiteSpace: 'pre-line',
  },
});

const menuItems = ['Activities, Outcomes, & Summaries', 'Listings with relevant surveillance', 'Complaints'];

function ChplQuarterView({
  dispatch,
  report,
}) {
  const relevantListingsQuery = useFetchRelevantListings({ id: report.id });
  const [activeListing, setActiveListing] = useState(undefined);
  const [bonusQuery, setBonusQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [state, setState] = useState(menuItems[0]);
  const classes = useStyles();

  useEffect(() => {
    setBonusQuery([
      `certificationBodies=${report.acb.name}`,
      `openDuringDateRange=${report.startDay},${report.endDay}`,
    ].sort((a, b) => (a < b ? -1 : 1)).join('&'));
  }, [report]);

  useEffect(() => {
    if (relevantListingsQuery.isLoading || !relevantListingsQuery.isSuccess) { return; }
    setListings(relevantListingsQuery.data);
  }, [relevantListingsQuery.data, relevantListingsQuery.isLoading, relevantListingsQuery.isSuccess]);

  const handleDispatch = (action) => {
    if (activeListing) {
      setActiveListing(undefined);
    } else {
      dispatch({ action });
    }
  };

  return (
    <>
      <div className={classes.container}>
        <Box className={classes.stickyColumn}>
          <Card className={classes.reportInfoCard}>
            <CardContent>
              <Typography variant="h6" component="h2"><strong>{`${report.acb?.name} Quarterly Surveillance Reporting`}</strong></Typography>
              <Typography variant="body1">{`${report.year} - ${report.quarter}`}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              {menuItems.map((item) => (
                <Button
                  key={item}
                  onClick={() => setState(item)}
                  disabled={state === item}
                  id={`navigation-${item}`}
                  fullWidth
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  className={classes.menuItems}
                >
                  <Box display="flex" flexDirection="row" gridGap={4}>
                    {item}
                  </Box>
                </Button>
              ))}
            </CardContent>
          </Card>
        </Box>
        {state === menuItems[0]
          && (
            <Card>
              <CardHeader title="Activities, Outcomes, & Summaries" />
              <CardContent>
                <Typography variant="h5" gutterbottom><strong>Surveillance Activities and Outcomes</strong></Typography>
                <Box className={classes.summaryGroup}>
                  <Typography style={{ fontWeight: 'bold' }} variant="h6">Randomized Surveillance – Selection Methods</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>The ONC-ACB used the following selection method to make its random selection of certified Health IT Modules for surveillance initiated during the reporting period.</Typography>
                  <Typography>{report.surveillanceActivitiesAndOutcomes}</Typography>
                  <Typography style={{ paddingTop: '4px' }} variant="body2" gutterbottom>
                    All Surveillance Activities and Outcomes, please log the surveillance activities and their outcomes to the &quot; Activities and Outcomes&quot; sheet of this workbook.
                  </Typography>
                </Box>
                <Divider />
                <Typography variant="h5" gutterbottom><strong>Sampling and Selecting</strong></Typography>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterbottom>Reactive Surveillance Summary</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>In order to meet its obligation to conduct reactive surveillance, the ONC-ACB undertook the following activities and implemented the following measures to ensure that it was able to systematically obtain, synthesize and act on all facts and circumstances that would cause a reasonable person to question the ongoing compliance of any certified Health IT Module.</Typography>
                  <Typography>{report.reactiveSurveillanceSummary}</Typography>
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterbottom>ICS Surveillance Summary</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>In order to meet requirements to conduct reactive surveillance on listings with multiple ICS requests, the ONC-ACB conducted the following ICS related surveillance. Please outline the number of ICS-related surveillances conducted, the method to surveil these products and the approach to include prioritized elements as outlined in the Surveillance Resource.</Typography>
                  <Typography style={{ maxHeight: '500px', overflowY: 'auto' }}>{report.icsSurveillanceSummary}</Typography>
                </Box>
                <Divider />
                <Box className={classes.summaryGroup}>
                  <Typography variant="h5" style={{ fontWeight: 'bold' }} gutterbottom>Prioritized Surveillance</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>The ONC-ACB undertook the following activities and implemented the following measures to evaluate and address the prioritized elements of surveillance referred to in Program Policy Resource #18-03 (October 5, 2018).</Typography>
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterbottom>Prioritized Criteria</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>Please describe which prioritized criteria were surveilled, how and with what frequency. Summarize the approach taken to conduct surveillance on these prioritized criteria.</Typography>
                  <Typography>{report.prioritizedElementSummary}</Typography>
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterbottom>Disclosure Requirements Summary</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>The ONC-ACB undertook the following activities and implemented the following measures to ensure adherence by developers to disclose additional types of costs or fees requirements, as required of the ONC-ACB under 45 CFR § 170.523(k):</Typography>
                  <Typography>{report.disclosureRequirementsSummary}</Typography>
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterbottom>Developer Complaints Log Review</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>
                    Describe the activities conducted in the past quarter related to the review of developers&lsquo; complaints logs. In your description be sure to discuss the extent to which the developer followed its internal complaints process and any deficiencies with its process. Please also indicate the frequency of complaints that the developer received that are associated with each of the prioritized elements as specified by ONC/ASTP. Additional insights on individual findings can be included in the Surveillance Activities and Outcomes under &quot;Surveillance Findings&quot;.
                  </Typography>
                  <Typography>{report.developerComplaintsLogReview}</Typography>
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterbottom>Post-certification Performance of Certified Capabilities</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>The assessment of potential non-conformities resulting from implementation or business practices of a developer that could affect the performance of certified capabilities in the field.</Typography>
                  <Typography>{report.postCertificationPerformanceOfCertifiedCapabilities}</Typography>
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterbottom>Appropriate Use of Mark</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>Describe activities and frequency of assessment of the appropriate use of the ONC Health IT Certification and Design Mark on developer public-facing materials.</Typography>
                  <Typography>{report.appropriateUseOfMark}</Typography>
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" style={{ fontWeight: 'bold' }} gutterbottom>Complaints Reported to ONC-ACB</Typography>
                  <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>
                    Please log the complaints and any actions to the &quot;Complaints&quot; sheet of this workbook.
                  </Typography>
                  <Typography>{`Listings with relevant surveillance for ${report.year} - ${report.quarter}`}</Typography>
                </Box>
                <Divider />
                <Typography variant="body2">
                  The titles and descriptions used in this module&apos;s user interface reflect the most recent version of the report and may appear differently for historical reports in the downloads
                </Typography>
              </CardContent>
            </Card>
          )}
        {state === menuItems[1]
          && (
            <Card>
              <CardHeader title="Listings with relevant surveillance" />
              <CardContent>
                {listings.map((l) => (
                  <Accordion key={l.chplProductNumber}>
                    <AccordionSummary
                      className={classes.accordionSummary}
                      expandIcon={(
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          endIcon={l.isExpanded ? <ArrowUpwardRounded /> : <ArrowDropDown />}
                        >
                          {l.isExpanded ? 'Hide Surveillance Group' : 'Show Surveillance Group'}
                        </Button>
                      )}
                      onClick={() => setExpanded(!expanded)}
                    >
                      <div className={classes.accordionSummaryContent}>
                        <Typography><strong>Product Number</strong></Typography>
                        <Typography><strong>Certification Date:</strong></Typography>
                        <Typography><strong># Relevant Surveillances:</strong></Typography>
                        <Typography>{l.chplProductNumber}</Typography>
                        <Typography>{getDisplayDateFormat(l.certificationDay)}</Typography>
                        <Typography>{l.surveillances.length}</Typography>
                      </div>
                    </AccordionSummary>
                    <AccordionDetails style={{ display: 'flex' }}>
                      <Box display="flex" flexDirection="column" gridGap={2} width="100%">
                        <ChplQuarterViewListing listing={l} surveillances={l.surveillances} />
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          )}
        {state === menuItems[2]
          && (
            <ChplComplaints
              disallowedFilters={['certificationBodies', 'receivedDate', 'closedDate']}
              bonusQuery={bonusQuery}
              canAdd={false}
            />
          )}
      </div>
      <ChplActionBar
        canCancel={false}
        canClose
        canSave={false}
        dispatch={handleDispatch}
      />
    </>
  );
}

export default ChplQuarterView;

ChplQuarterView.propTypes = {
  dispatch: func.isRequired,
  report: object.isRequired,
};
