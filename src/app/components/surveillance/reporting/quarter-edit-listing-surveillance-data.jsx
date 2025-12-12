import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { func, object } from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchSurveillanceOutcomes } from 'api/data';
import { useDeleteQuarterly, useFetchRelevantListings, usePutQuarterly } from 'api/surveillance';
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
  surveillanceOutcome: yup.object(),
  surveillanceOutcomeOther: yup.string()
    .test('conditionallyRequiredSurveillanceOutcome',
      'Outcome of Surveillance - Other Description is required',
      (value, context) => (!!value || context.parent.surveillanceOutcome?.name !== 'Non-conformity substantiated - Unresolved - Other - [Please describe]')),
  surveillanceProcessTypeOther: yup.string(),
  surveillanceGroundsForInitiatingOther: yup.string(),
  nonconformityCauses: yup.string(),
  nonconformityNature: yup.string(),
  stepsToSurveil: yup.string(),
  stepsToEngage: yup.string(),
  additionalCostsEvaluation: yup.string(),
  limitationsEvaluation: yup.string(),
  nondisclosureEvaluation: yup.string(),
  directionDeveloperResolution: yup.string(),
  capStatusOther: yup.string(),
  surveillanceFindings: yup.string(),
});

function ChplQuarterEditListingSurveillanceData({ dispatch, surveillance }) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: deleteReport } = useDeleteQuarterly();
  const { mutate: putReport } = usePutQuarterly();
  const [surveillanceOutcomes, setSurveillanceOutcomes] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: surveillanceOutcomesData, isLoading: surveillanceOutcomesIsLoading, isSuccess: surveillanceOutcomesIsSuccess } = useFetchSurveillanceOutcomes();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (surveillanceOutcomesIsLoading || !surveillanceOutcomesIsSuccess) { return; }
    setSurveillanceOutcomes(surveillanceOutcomesData.sort((a, b) => (a.name < b.name ? -1 : 1)));
    formik.setFieldValue('surveillanceOutcome', surveillanceOutcomesData.find((type) => type.id === surveillance?.surveillanceOutcome?.id) || '');
  }, [surveillanceOutcomesData, surveillanceOutcomesIsLoading, surveillanceOutcomesIsSuccess, surveillance]);

  const handleDispatch = (action) => {
    switch (action) {
      case 'save':
        formik.submitForm();
        break;
      default:
        console.log(action);
        dispatch({ action });
        break;
    }
  };

  const save = () => {
    //setIsProcessing(true);
    setErrorMessages([]);
    const payload = {
      ...surveillance,
      surveillanceOutcome: formik.values.surveillanceOutcome,
      surveillanceOutcomeOther: formik.values.surveillanceOutcomeOther,
      surveillanceProcessTypeOther: formik.values.surveillanceProcessTypeOther,
      surveillanceGroundsForInitiatingOther: formik.values.surveillanceGroundsForInitiatingOther,
      nonconformityCauses: formik.values.nonconformityCauses,
      nonconformityNature: formik.values.nonconformityNature,
      stepsToSurveil: formik.values.stepsToSurveil,
      stepsToEngage: formik.values.stepsToEngage,
      additionalCostsEvaluation: formik.values.additionalCostsEvaluation,
      limitationsEvaluation: formik.values.limitationsEvaluation,
      nondisclosureEvaluation: formik.values.nondisclosureEvaluation,
      directionDeveloperResolution: formik.values.directionDeveloperResolution,
      capStatusOther: formik.values.capStatusOther,
      surveillanceFindings: formik.values.surveillanceFindings,
    };
    console.log({payload});
    /*
    putReport(payload, {
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
    */
  };

  formik = useFormik({
    initialValues: {
      /*
      surveillanceActivitiesAndOutcomes: report.surveillanceActivitiesAndOutcomes || '',
      reactiveSurveillanceSummary: report.reactiveSurveillanceSummary || '',
      icsSurveillanceSummary: report.icsSurveillanceSummary || '',
      prioritizedElementSummary: report.prioritizedElementSummary || '',
      disclosureRequirementsSummary: report.disclosureRequirementsSummary || '',
      developerComplaintsLogReview: report.developerComplaintsLogReview || '',
      postCertificationPerformanceOfCertifiedCapabilities: report.postCertificationPerformanceOfCertifiedCapabilities || '',
      appropriateUseOfMark: report.appropriateUseOfMark || '',
      */
      surveillanceOutcome: surveillance.surveillanceOutcome,
      surveillanceOutcomeOther: surveillance.surveillanceOutcomeOther || '',
      surveillanceProcessTypeOther: surveillance.surveillanceProcessTypeOther || '',
      surveillanceGroundsForInitiatingOther: surveillance.surveillanceGroundsForInitiatingOther || '',
      nonconformityCauses: surveillance.nonconformityCauses || '',
      nonconformityNature: surveillance.nonconformityNature || '',
      stepsToSurveil: surveillance.stepsToSurveil || '',
      stepsToEngage: surveillance.stepsToEngage || '',
      additionalCostsEvaluation: surveillance.additionalCostsEvaluation || '',
      limitationsEvaluation: surveillance.limitationsEvaluation || '',
      nondisclosureEvaluation: surveillance.nondisclosureEvaluation || '',
      directionDeveloperResolution: surveillance.directionDeveloperResolution || '',
      capStatusOther: surveillance.capStatusOther || '',
      surveillanceFindings: surveillance.surveillanceFindings || '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  if (surveillanceOutcomesIsLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <Typography>
        <strong>Surveillance Type:</strong>
        {' '}
        { surveillance.surveillanceType?.name }
      </Typography>
      <Typography>
        <strong>k1 Reviewed:</strong>
        {' '}
        { surveillance.k1Reviewed ? 'Yes' : 'No' }
      </Typography>
      <ChplTextField
        select
        id="surveillance-outcome"
        name="surveillanceOutcome"
        label="Outcome of Surveillance"
        value={formik.values.surveillanceOutcome}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.surveillanceOutcome && !!formik.errors.surveillanceOutcome}
        helperText={formik.touched.surveillanceOutcome && formik.errors.surveillanceOutcome}
      >
        { surveillanceOutcomes.map((item) => (
          <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
        ))}
      </ChplTextField>
      { formik.values.surveillanceOutcome?.name === 'Non-conformity substantiated - Unresolved - Other - [Please describe]'
        && (
          <Box className={classes.summaryGroup}>
            <Typography variant="h6" gutterBottom>
              <strong>Outcome of Surveillance - Other Explanation</strong>
            </Typography>
            <ChplTextField
              id="surveillance-outcome-other"
              name="surveillanceOutcomeOther"
              label="Outcome of Surveillance - Other Explanation"
              multiline
              required
              value={formik.values.surveillanceOutcomeOther}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.surveillanceOutcomeOther && !!formik.errors.surveillanceOutcomeOther}
              helperText={formik.touched.surveillanceOutcomeOther && formik.errors.surveillanceOutcomeOther}
            />
          </Box>
        )}
      <Typography>
        <strong>Surveillance Process Types:</strong>
        {' '}
        { surveillance.surveillanceProcessTypes.map((s) => s.name).join('; ') }
      </Typography>
      { surveillance.surveillanceProcessTypes.some((s) => s.name === 'Other')
        && (
          <Box className={classes.summaryGroup}>
            <Typography variant="h6" gutterBottom>
              <strong>Surveillance Process Type - Other Explanation</strong>
            </Typography>
            <ChplTextField
              id="surveillance-process-type-other"
              name="surveillanceProcessTypeOther"
              label="Surveillance Process Type - Other Explanation"
              multiline
              value={formik.values.surveillanceProcessTypeOther}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.surveillanceProcessTypeOther && !!formik.errors.surveillanceProcessTypeOther}
              helperText={formik.touched.surveillanceProcessTypeOther && formik.errors.surveillanceProcessTypeOther}
            />
          </Box>
        )}
      <Typography>
        <strong>Surveillance Grounds For Initiating:</strong>
        {' '}
        { surveillance.surveillanceGroundsForInitiating.map((s) => s.name).join('; ') }
      </Typography>
      { surveillance.surveillanceGroundsForInitiating.some((s) => s.name === 'Other')
        && (
          <Box className={classes.summaryGroup}>
            <Typography variant="h6" gutterBottom>
              <strong>Grounds For Initiating Surveillance - Other</strong>
            </Typography>
            <ChplTextField
              id="surveillance-grounds-for-initiating-other"
              name="surveillanceGroundsForInitiatingOther"
              label="SurveillanceGroundsForInitiatingOther"
              multiline
              value={formik.values.surveillanceGroundsForInitiatingOther}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.surveillanceGroundsForInitiatingOther && !!formik.errors.surveillanceGroundsForInitiatingOther}
              helperText={formik.touched.surveillanceGroundsForInitiatingOther && formik.errors.surveillanceGroundsForInitiatingOther}
            />
          </Box>
        )}
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Potential Causes of Non-Conformities or Suspected Non-Conformities</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          What were the substantial factors that, in the ONC-ACB's assessment, caused or contributed to the suspected non-conformity or non-conformities (e.g., implementation problem, user error, limitations on the use of capabilities in the field, a failure to disclose known material information, etc.)?
        </Typography>
        <ChplTextField
          id="nonconformity-causes"
          name="nonconformityCauses"
          label="Potential Causes of Non-Conformities or Suspected Non-Conformities"
          multiline
          value={formik.values.nonconformityCauses}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nonconformityCauses && !!formik.errors.nonconformityCauses}
          helperText={formik.touched.nonconformityCauses && formik.errors.nonconformityCauses}
        />
      </Box>
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Nature of Any Substantiated Non-Conformities</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          Did ONC-ACB substantiate any non-conformities? If so, what was the nature of the non-conformity or non-conformities that were substantiated? Please include specific criteria involved.
        </Typography>
        <ChplTextField
          id="nonconformity-nature"
          name="nonconformityNature"
          label="Nonconformity Nature"
          multiline
          value={formik.values.nonconformityNature}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nonconformityNature && !!formik.errors.nonconformityNature}
          helperText={formik.touched.nonconformityNature && formik.errors.nonconformityNature}
        />
      </Box>
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Steps to Surveil and Substantiate</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          What steps did the ONC-ACB take to surveil the Health IT Module, to analyze evidence, and to substantiate the non-conformity or non-conformities?
        </Typography>
        <ChplTextField
          id="steps-to-surveil"
          name="stepsToSurveil"
          label="Steps to Surveil and Substantiate"
          multiline
          value={formik.values.stepsToSurveil}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.stepsToSurveil && !!formik.errors.stepsToSurveil}
          helperText={formik.touched.stepsToSurveil && formik.errors.stepsToSurveil}
        />
      </Box>
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Steps to Engage and Work with Developer and End-Users</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          What steps were taken by ONC-ACB to engage and work with the developer and end-users to analyze and determine the causes of any suspected non-conformities and related deficiencies?
        </Typography>
        <ChplTextField
          id="steps-to-engage"
          name="stepsToEngage"
          label="Steps To Engage and Work with Developer and End-Users"
          multiline
          value={formik.values.stepsToEngage}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.stepsToEngage && !!formik.errors.stepsToEngage}
          helperText={formik.touched.stepsToEngage && formik.errors.stepsToEngage}
        />
      </Box>
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Additional Costs Evaluation</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          If a suspected non-conformity resulted from additional types of costs or fees that a user was required to pay in order to implement or use the Health IT Module's certified capabilities, how did ONC-ACB evaluate that suspected non-conformity?
        </Typography>
        <ChplTextField
          id="additional-costs-evaluation"
          name="additionalCostsEvaluation"
          label="Additional Costs Evaluation"
          multiline
          value={formik.values.additionalCostsEvaluation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.additionalCostsEvaluation && !!formik.errors.additionalCostsEvaluation}
          helperText={formik.touched.additionalCostsEvaluation && formik.errors.additionalCostsEvaluation}
        />
      </Box>
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Limitations Evaluation</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          If a suspected non-conformity resulted from limitations that a user encountered in the course of implementing and using the Health IT Module's certified capabilities, how did ONC-ACB evaluate that suspected non-conformity?
        </Typography>
        <ChplTextField
          id="limitations-evaluation"
          name="limitationsEvaluation"
          label="Limitations Evaluation"
          multiline
          value={formik.values.limitationsEvaluation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.limitationsEvaluation && !!formik.errors.limitationsEvaluation}
          helperText={formik.touched.limitationsEvaluation && formik.errors.limitationsEvaluation}
        />
      </Box>
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Non-Disclosure Evaluation</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          If a suspected non-conformity resulted from the non-disclosure of material information by the developer about additional types of costs or fees associated with the Health IT Module, how did the ONC-ACB evaluate the suspected non-conformity?
        </Typography>
        <ChplTextField
          id="nondisclosure-evaluation"
          name="nondisclosureEvaluation"
          label="Non-Disclosure Evaluation"
          multiline
          value={formik.values.nondisclosureEvaluation}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nondisclosureEvaluation && !!formik.errors.nondisclosureEvaluation}
          helperText={formik.touched.nondisclosureEvaluation && formik.errors.nondisclosureEvaluation}
        />
      </Box>
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Direction for Developer Resolution</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          If a non-conformity was substantiated, what direction was given to the developer to resolve the non-conformity?
        </Typography>
        <ChplTextField
          id="direction-developer-resolution"
          name="directionDeveloperResolution"
          label="Direction for Developer Resolution"
          multiline
          value={formik.values.directionDeveloperResolution}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.directionDeveloperResolution && !!formik.errors.directionDeveloperResolution}
          helperText={formik.touched.directionDeveloperResolution && formik.errors.directionDeveloperResolution}
        />
      </Box>
      <Typography>
        <strong>CAP Statuses:</strong>
        {' '}
        { surveillance.capStatuses.map((s) => s.name).join('; ') }
      </Typography>
      { surveillance.capStatuses.some((s) => s.name === 'Other')
        && (
          <Box className={classes.summaryGroup}>
            <Typography variant="h6" gutterBottom>
              <strong>CAP Status - Other</strong>
            </Typography>
            <ChplTextField
              id="cap-status-other"
              name="capStatusOther"
              label="CAP Status - Other"
              multiline
              value={formik.values.capStatusOther}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.capStatusOther && !!formik.errors.capStatusOther}
              helperText={formik.touched.capStatusOther && formik.errors.capStatusOther}
            />
          </Box>
        )}
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Surveillance Findings</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          If the surveilled activity resulted in no non-conformity but the ONC-ACB surveilled prioritized elements, as identified by the ONC Certification Program, the ONC-ACB should use this field to report on any activity and findings related to that aspect of surveillance.
        </Typography>
        <ChplTextField
          id="surveillance-findings"
          name="surveillanceFindings"
          label="Surveillance Findings"
          multiline
          value={formik.values.surveillanceFindings}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.surveillanceFindings && !!formik.errors.surveillanceFindings}
          helperText={formik.touched.surveillanceFindings && formik.errors.surveillanceFindings}
        />
      </Box>
      <ChplActionBar
        dispatch={handleDispatch}
        disabled={!formik.isValid}
        errors={errorMessages}
        isProcessing={isProcessing}
      />
    </>
  );
}

export default ChplQuarterEditListingSurveillanceData;

ChplQuarterEditListingSurveillanceData.propTypes = {
  dispatch: func.isRequired,
  surveillance: object.isRequired,
};
