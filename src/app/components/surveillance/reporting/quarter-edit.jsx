import React, { useEffect, useState } from 'react';
import {
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
import { func, object } from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplQuarterViewListing from './quarter-view-listing';

import { useFetchRelevantListings, usePutQuarterly } from 'api/surveillance';
import ChplComplaints from 'components/surveillance/complaints/complaints';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
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
  question: {
    paddingBottom: '4px',
    color: '#373737',
  },
  responseBox: {
    padding: '16px',
    backgroundColor: '#eee',
    border: '1px solid #afafaf',
    borderRadius: '4px',
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

const validationSchema = yup.object({
  obstacleSummary: yup.string()
    .required('Field is required'),
  priorityChangesFromFindingsSummary: yup.string()
    .required('Field is required'),
});

const menuItems = ['Activities, Outcomes, & Summaries', 'Listings with relevant surveillance', 'Complaints'];

function ChplQuarterEdit({ dispatch, report }) {
  const relevantListingsQuery = useFetchRelevantListings({ id: report.id });
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePutQuarterly();
  const [bonusQuery, setBonusQuery] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [listings, setListings] = useState([]);
  const [state, setState] = useState(menuItems[0]);
  const classes = useStyles();
  let formik;

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
    console.log(action);
    switch (action) {
      case 'save':
        formik.submitForm();
        break;
      default:
        dispatch({ action });
        break;
    }
  };

  const save = () => {
    console.log('saving');
    setIsProcessing(true);
    setErrorMessages([]);
    const payload = {
      ...report,
      surveillanceActivitiesAndOutcomes: formik.values.surveillanceActivitiesAndOutcomes,
      reactiveSurveillanceSummary: formik.values.reactiveSurveillanceSummary,
      icsSurveillanceSummary: formik.values.icsSurveillanceSummary,
      prioritizedElementSummary: formik.values.prioritizedElementSummary,
      disclosureRequirementsSummary: formik.values.disclosureRequirementsSummary,
      developerComplaintsLogReview: formik.values.developerComplaintsLogReview,
      postCertificationPerformanceOfCertifiedCapabilities: formik.values.postCertificationPerformanceOfCertifiedCapabilities,
      appropriateUseOfMark: formik.values.appropriateUseOfMark,
    };
    console.log(payload);
    mutate(payload, {
      onSuccess: () => {
        setIsProcessing(false);
        enqueueSnackbar('Your updates have been made', {
          variant: 'success',
        });
        dispatch({ action: 'cancel' });
      },
      onError: (error) => {
        setIsProcessing(false);
        setErrorMessages([error.response?.data?.error]);
      },
    });
  };

  formik = useFormik({
    initialValues: {
      surveillanceActivitiesAndOutcomes: report.surveillanceActivitiesAndOutcomes || '',
      reactiveSurveillanceSummary: report.reactiveSurveillanceSummary || '',
      icsSurveillanceSummary: report.icsSurveillanceSummary || '',
      prioritizedElementSummary: report.prioritizedElementSummary || '',
      disclosureRequirementsSummary: report.disclosureRequirementsSummary || '',
      developerComplaintsLogReview: report.developerComplaintsLogReview || '',
      postCertificationPerformanceOfCertifiedCapabilities: report.postCertificationPerformanceOfCertifiedCapabilities || '',
      appropriateUseOfMark: report.appropriateUseOfMark || '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  return (
    <>
      <div className={classes.container}>
        <Box className={classes.stickyColumn}>
          <Card className={classes.reportInfoCard}>
            <CardContent>
              <Typography variant="h6" component="h2">
                <strong>{`${report.acb?.name} Quarterly Surveillance Reporting`}</strong>
              </Typography>
              <Typography variant="body1">
                {`${report.year} - ${report.quarter}`}
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              { menuItems.map((item) => (
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
                    { item }
                  </Box>
                </Button>
              ))}
            </CardContent>
          </Card>
        </Box>
        { state === menuItems[0]
          && (
            <Card>
              <CardHeader title="Activities, Outcomes, & Summaries" />
              <CardContent>
                <Typography variant="h5" gutterBottom><strong>Surveillance Activities and Outcomes</strong></Typography>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6">
                    <strong>Randomized Surveillance – Selection Methods</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    The ONC-ACB used the following selection method to make its random selection of certified Health IT Modules for surveillance initiated during the reporting period.
                  </Typography>
                  <ChplTextField
                    id="surveillanceActivitiesAndOutcomes"
                    name="surveillanceActivitiesAndOutcomes"
                    label="Obstacle Summary"
                    required
                    value={formik.values.surveillanceActivitiesAndOutcomes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.surveillanceActivitiesAndOutcomes && !!formik.errors.surveillanceActivitiesAndOutcomes}
                    helperText={formik.touched.surveillanceActivitiesAndOutcomes && formik.errors.surveillanceActivitiesAndOutcomes}
                  />
                  <Typography style={{ paddingTop: '4px' }} variant="body2" gutterBottom>
                    All Surveillance Activities and Outcomes.
                  </Typography>
                  <Typography style={{ paddingTop: '4px' }} variant="body2" gutterBottom>
                    Please log the surveillance activities and their outcomes to the &quot;Activities and Outcomes&quot; sheet of this workbook.
                  </Typography>
                </Box>
                <Divider />
                <Typography variant="h5" gutterBottom>
                  <strong>Sampling and Selecting</strong>
                </Typography>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Reactive Surveillance Summary</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    In order to meet its obligation to conduct reactive surveillance, the ONC-ACB undertook the following activities and implemented the following measures to ensure that it was able to systematically obtain, synthesize and act on all facts and circumstances that would cause a reasonable person to question the ongoing compliance of any certified Health IT Module.
                  </Typography>
                  <ChplTextField
                    id="reactiveSurveillanceSummary"
                    name="reactiveSurveillanceSummary"
                    label="Obstacle Summary"
                    required
                    value={formik.values.reactiveSurveillanceSummary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.reactiveSurveillanceSummary && !!formik.errors.reactiveSurveillanceSummary}
                    helperText={formik.touched.reactiveSurveillanceSummary && formik.errors.reactiveSurveillanceSummary}
                  />
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" gutterBottom>
                    <strong>ICS Surveillance Summary</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    In order to meet requirements to conduct reactive surveillance on listings with multiple ICS requests, the ONC-ACB conducted the following ICS related surveillance. Please outline the number of ICS-related surveillances conducted, the method to surveil these products and the approach to include prioritized elements as outlined in the Surveillance Resource.
                  </Typography>
                  <ChplTextField
                    id="icsSurveillanceSummary"
                    name="icsSurveillanceSummary"
                    label="Obstacle Summary"
                    required
                    value={formik.values.icsSurveillanceSummary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.icsSurveillanceSummary && !!formik.errors.icsSurveillanceSummary}
                    helperText={formik.touched.icsSurveillanceSummary && formik.errors.icsSurveillanceSummary}
                  />
                </Box>
                <Divider />
                <Box className={classes.summaryGroup}>
                  <Typography variant="h5" gutterBottom>
                    <strong>Prioritized Surveillance</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    The ONC-ACB undertook the following activities and implemented the following measures to evaluate and address the prioritized elements of surveillance referred to in Program Policy Resource #18-03 (October 5, 2018).
                  </Typography>
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Prioritized Criteria</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    Please describe which prioritized criteria were surveilled, how and with what frequency. Summarize the approach taken to conduct surveillance on these prioritized criteria.
                  </Typography>
                  <ChplTextField
                    id="prioritizedElementSummary"
                    name="prioritizedElementSummary"
                    label="Obstacle Summary"
                    required
                    value={formik.values.prioritizedElementSummary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.prioritizedElementSummary && !!formik.errors.prioritizedElementSummary}
                    helperText={formik.touched.prioritizedElementSummary && formik.errors.prioritizedElementSummary}
                  />
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Disclosure Requirements Summary</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    The ONC-ACB undertook the following activities and implemented the following measures to ensure adherence by developers to disclose additional types of costs or fees requirements, as required of the ONC-ACB under 45 CFR § 170.523(k):
                  </Typography>
                  <ChplTextField
                    id="disclosureRequirementsSummary"
                    name="disclosureRequirementsSummary"
                    label="Obstacle Summary"
                    required
                    value={formik.values.disclosureRequirementsSummary}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.disclosureRequirementsSummary && !!formik.errors.disclosureRequirementsSummary}
                    helperText={formik.touched.disclosureRequirementsSummary && formik.errors.disclosureRequirementsSummary}
                  />
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Developer Complaints Log Review</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    Describe the activities conducted in the past quarter related to the review of developers&lsquo; complaints logs. In your description be sure to discuss the extent to which the developer followed its internal complaints process and any deficiencies with its process. Please also indicate the frequency of complaints that the developer received that are associated with each of the prioritized elements as specified by ONC/ASTP. Additional insights on individual findings can be included in the Surveillance Activities and Outcomes under &quot;Surveillance Findings&quot;.
                  </Typography>
                  <ChplTextField
                    id="developerComplaintsLogReview"
                    name="developerComplaintsLogReview"
                    label="Obstacle Summary"
                    required
                    value={formik.values.developerComplaintsLogReview}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.developerComplaintsLogReview && !!formik.errors.developerComplaintsLogReview}
                    helperText={formik.touched.developerComplaintsLogReview && formik.errors.developerComplaintsLogReview}
                  />
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" gutterBottom>
                    <strong> Post-certification Performance of Certified Capabilities</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    The assessment of potential non-conformities resulting from implementation or business practices of a developer that could affect the performance of certified capabilities in the field.
                  </Typography>
                  <ChplTextField
                    id="postCertificationPerformanceOfCertifiedCapabilities"
                    name="postCertificationPerformanceOfCertifiedCapabilities"
                    label="Obstacle Summary"
                    required
                    value={formik.values.postCertificationPerformanceOfCertifiedCapabilities}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.postCertificationPerformanceOfCertifiedCapabilities && !!formik.errors.postCertificationPerformanceOfCertifiedCapabilities}
                    helperText={formik.touched.postCertificationPerformanceOfCertifiedCapabilities && formik.errors.postCertificationPerformanceOfCertifiedCapabilities}
                  />
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Appropriate Use of Mark</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    Describe activities and frequency of assessment of the appropriate use of the ONC Health IT Certification and Design Mark on developer public-facing materials.
                  </Typography>

                  <ChplTextField
                    id="appropriateUseOfMark"
                    name="appropriateUseOfMark"
                    label="Obstacle Summary"
                    required
                    value={formik.values.appropriateUseOfMark}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.appropriateUseOfMark && !!formik.errors.appropriateUseOfMark}
                    helperText={formik.touched.appropriateUseOfMark && formik.errors.appropriateUseOfMark}
                  />
                </Box>
                <Box className={classes.summaryGroup}>
                  <Typography variant="h6" gutterBottom>
                    <strong>Complaints Reported to ONC-ACB</strong>
                  </Typography>
                  <Typography className={classes.question} variant="body2" gutterBottom>
                    Please log the complaints and any actions to the &quot;Complaints&quot; sheet of this workbook.
                  </Typography>
                </Box>
                <Divider />
                <Typography variant="body2">
                  The titles and descriptions used in this module&apos;s user interface reflect the most recent version of the report and may appear differently for historical reports in the downloads
                </Typography>
              </CardContent>
            </Card>
          )}
        { state === menuItems[1]
          && (
            <Card>
              <CardHeader title="Listings with relevant surveillance" />
              <CardContent>
                { listings.map((l) => (
                  <ChplQuarterViewListing
                    key={l.id}
                    listing={l}
                  />
                ))}
              </CardContent>
            </Card>
          )}
        { state === menuItems[2]
          && (
            <ChplComplaints
              disallowedFilters={['certificationBodies', 'receivedDate', 'closedDate']}
              bonusQuery={bonusQuery}
              canAdd={false}
            />
          )}
      </div>
      <ChplActionBar
        dispatch={handleDispatch}
        disabled={!formik.isValid}
        errors={errorMessages}
        isProcessing={isProcessing}
      />
    </>
  );
}

export default ChplQuarterEdit;

ChplQuarterEdit.propTypes = {
  dispatch: func.isRequired,
  report: object.isRequired,
};
