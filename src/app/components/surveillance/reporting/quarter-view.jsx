import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  number,
  object,
  string,
} from 'prop-types';

import { useFetchRelevantListings } from 'api/surveillance';
import { ChplActionBar } from 'components/action-bar';
import { getDisplayDateFormat } from 'services/date-util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplQuarterView({
  dispatch,
  report,
}) {
  const relevantListingsQuery = useFetchRelevantListings({ id: report.id });
  const [listings, setListings] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (relevantListingsQuery.isLoading || !relevantListingsQuery.isSuccess) { return; }
    setListings(relevantListingsQuery.data);
  }, [relevantListingsQuery.data, relevantListingsQuery.isLoading, relevantListingsQuery.isSuccess]);

  const handleDispatch = (action) => {
    dispatch({ action });
  };

  return (
    <>
      <Typography>{`${report.acb?.name} Quarterly Surveillance Reporting`}</Typography>
      <Typography>{`${report.year} - ${report.quarter}`}</Typography>
      <Typography>The titles and descriptions used in this module’s user interface reflect the most recent version of the report and may appear differently for historical reports in the downloads</Typography>
      <Typography>Surveillance Activities and Outcomes</Typography>
      <Typography>Randomized Surveillance – Selection Methods</Typography>
      <Typography>The ONC-ACB used the following selection method to make its random selection of certified Health IT Modules for surveillance initiated during the reporting period.</Typography>
      <Typography>{ report.surveillanceActivitiesAndOutcomes }</Typography>
      <Typography>All Surveillance Activities and Outcomes</Typography>
      <Typography>Please log the surveillance activities and their outcomes to the "Activities and Outcomes" sheet of this workbook.</Typography>
      <Typography>Sampling and Selecting</Typography>
      <Typography>Reactive Surveillance Summary</Typography>
      <Typography>In order to meet its obligation to conduct reactive surveillance, the ONC-ACB undertook the following activities and implemented the following measures to ensure that it was able to systematically obtain, synthesize and act on all facts and circumstances that would cause a reasonable person to question the ongoing compliance of any certified Health IT Module.</Typography>
      <Typography>{ report.reactiveSurveillanceSummary }</Typography>
      <Typography>ICS Surveillance Summary</Typography>
      <Typography>In order to meet requirements to conduct reactive surveillance on listings with multiple ICS requests, the ONC-ACB conducted the following ICS related surveillance. Please outline the number of ICS-related surveillances conducted, the method to surveil these products and the approach to include prioritized elements as outlined in the Surveillance Resource.</Typography>
      <Typography>{ report.icsSurveillanceSummary }</Typography>
      <Typography>Prioritized Surveillance</Typography>
      <Typography>The ONC-ACB undertook the following activities and implemented the following measures to evaluate and address the prioritized elements of surveillance referred to in Program Policy Resource #18-03 (October 5, 2018).</Typography>
      <Typography>Prioritized Criteria</Typography>
      <Typography>Please describe which prioritized criteria were surveilled, how and with what frequency. Summarize the approach taken to conduct surveillance on these prioritized criteria.</Typography>
      <Typography>{ report.prioritizedElementSummary }</Typography>
      <Typography>Disclosure Requirements Summary</Typography>
      <Typography>The ONC-ACB undertook the following activities and implemented the following measures to ensure adherence by developers to disclose additional types of costs or fees requirements, as required of the ONC-ACB under 45 CFR § 170.523(k):</Typography>
      <Typography>{ report.disclosureRequirementsSummary }</Typography>
      <Typography>Developer Complaints Log Review</Typography>
      <Typography>Describe the activities conducted in the past quarter related to the review of developers' complaints logs. In your description be sure to discuss the extent to which the developer followed its internal complaints process and any deficiencies with its process. Please also indicate the frequency of complaints that the developer received that are associated with each of the prioritized elements as specified by ONC/ASTP. Additional insights on individual findings can be included in the Surveillance Activities and Outcomes under "Surveillance Findings".</Typography>
      <Typography>{ report.developerComplaintsLogReview }</Typography>
      <Typography>Post-certification Performance of Certified Capabilities</Typography>
      <Typography>The assessment of potential non-conformities resulting from implementation or business practices of a developer that could affect the performance of certified capabilities in the field.</Typography>
      <Typography>{ report.postCertificationPerformanceOfCertifiedCapabilities }</Typography>
      <Typography>Appropriate Use of Mark</Typography>
      <Typography>Describe activities and frequency of assessment of the appropriate use of the ONC Health IT Certification and Design Mark on developer public-facing materials.</Typography>
      <Typography>{ report.appropriateUseOfMark }</Typography>
      <Typography>Complaints Reported to ONC-ACB</Typography>
      <Typography>Please log the complaints and any actions to the "Complaints" sheet of this workbook.</Typography>
      <Typography>{`Listings with relevant surveillance for ${report.year} - ${report.quarter}`}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>CHPL Product Number</TableCell>
            <TableCell>Certification Date</TableCell>
            <TableCell># Relevant Surveillances</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { listings.map((l) => (
            <TableRow key={l.chplProductNumber}>
              <TableCell>{ l.chplProductNumber }</TableCell>
              <TableCell>{ getDisplayDateFormat(l.certificationDay) }</TableCell>
              <TableCell>{ l.surveillances.length }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
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
