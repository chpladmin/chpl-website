import React, { useEffect, useState } from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  ListItemText,
  MenuItem,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func, number, object } from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

import {
  useFetchCapStatuses,
  useFetchSurveillanceGroundsForInitiating,
  useFetchSurveillanceOutcomes,
  useFetchSurveillanceProcessTypes,
} from 'api/data';
import { usePutRelevantSurveillance } from 'api/surveillance';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  question: {
    paddingBottom: '4px',
    color: '#373737',
  },
  summaryGroup: {
    margin: '8px 0',
    whiteSpace: 'pre-line',
  },
});

const validationSchema = yup.object({
  surveillanceOutcome: yup.string(),
  surveillanceOutcomeOther: yup.string()
    .test('conditionallyRequireSurveillanceOutcome',
      'Outcome of Surveillance - Other Explanation is required',
      (value, context) => (!!value || context.parent.surveillanceOutcome !== 'Non-conformity substantiated - Unresolved - Other - [Please describe]')),
  surveillanceProcessTypes: yup.array(),
  surveillanceProcessTypeOther: yup.string()
    .test('conditionallyRequireSurveillanceProcessTypes',
      'Surveillance Process Type - Other Explanation is required',
      (value, context) => (!!value || context.parent.surveillanceProcessTypes?.every((t) => t.name !== 'Other'))),
  surveillanceGroundsForInitiating: yup.array(),
  surveillanceGroundsForInitiatingOther: yup.string()
    .test('conditionallyRequireSurveillanceGroundsForInitiating',
      'Grounds For Initiating Surveillance - Other Explanation is required',
      (value, context) => (!!value || context.parent.surveillanceGroundsForInitiating?.every((t) => t.name !== 'Other'))),
  nonconformityCauses: yup.string(),
  nonconformityNature: yup.string(),
  stepsToSurveil: yup.string(),
  stepsToEngage: yup.string(),
  additionalCostsEvaluation: yup.string(),
  limitationsEvaluation: yup.string(),
  nondisclosureEvaluation: yup.string(),
  directionDeveloperResolution: yup.string(),
  capStatuses: yup.array(),
  capStatusOther: yup.string()
    .test('conditionallyRequireCapStatuses',
      'CAP Status - Explanation',
      (value, context) => (!!value || context.parent.capStatuses?.every((t) => t.name !== 'Other'))),
  surveillanceFindings: yup.string(),
});

function ChplQuarterEditListingSurveillanceData({ dispatch, reportId, surveillance }) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePutRelevantSurveillance();
  const [capStatuses, setCapStatuses] = useState([]);
  const [surveillanceGroundsForInitiating, setSurveillanceGroundsForInitiating] = useState([]);
  const [surveillanceOutcomes, setSurveillanceOutcomes] = useState([]);
  const [surveillanceProcessTypes, setSurveillanceProcessTypes] = useState([]);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: capStatusesData, isLoading: capStatusesIsLoading, isSuccess: capStatusesIsSuccess } = useFetchCapStatuses();
  const { data: surveillanceGroundsForInitiatingData, isLoading: surveillanceGroundsForInitiatingIsLoading, isSuccess: surveillanceGroundsForInitiatingIsSuccess } = useFetchSurveillanceGroundsForInitiating();
  const { data: surveillanceOutcomesData, isLoading: surveillanceOutcomesIsLoading, isSuccess: surveillanceOutcomesIsSuccess } = useFetchSurveillanceOutcomes();
  const { data: surveillanceProcessTypesData, isLoading: surveillanceProcessTypesIsLoading, isSuccess: surveillanceProcessTypesIsSuccess } = useFetchSurveillanceProcessTypes();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    formik.setFieldValue('capStatuses', surveillance?.capStatuses);
    formik.setFieldValue('surveillanceGroundsForInitiating', surveillance?.surveillanceGroundsForInitiating);
    formik.setFieldValue('surveillanceProcessTypes', surveillance?.surveillanceProcessTypes);
  }, []);

  useEffect(() => {
    if (capStatusesIsLoading || !capStatusesIsSuccess) { return; }
    setCapStatuses(capStatusesData.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [capStatusesData, capStatusesIsLoading, capStatusesIsSuccess, surveillance]);

  useEffect(() => {
    if (surveillanceGroundsForInitiatingIsLoading || !surveillanceGroundsForInitiatingIsSuccess) { return; }
    setSurveillanceGroundsForInitiating(surveillanceGroundsForInitiatingData.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [surveillanceGroundsForInitiatingData, surveillanceGroundsForInitiatingIsLoading, surveillanceGroundsForInitiatingIsSuccess, surveillance]);

  useEffect(() => {
    if (surveillanceOutcomesIsLoading || !surveillanceOutcomesIsSuccess) { return; }
    setSurveillanceOutcomes(surveillanceOutcomesData.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [surveillanceOutcomesData, surveillanceOutcomesIsLoading, surveillanceOutcomesIsSuccess, surveillance]);

  useEffect(() => {
    if (surveillanceProcessTypesIsLoading || !surveillanceProcessTypesIsSuccess) { return; }
    setSurveillanceProcessTypes(surveillanceProcessTypesData.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [surveillanceProcessTypesData, surveillanceProcessTypesIsLoading, surveillanceProcessTypesIsSuccess, surveillance]);

  const handleDispatch = (action) => {
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
    setIsProcessing(true);
    setErrorMessages([]);
    const payload = {
      ...surveillance,
      reportId,
      k1Reviewed: formik.values.k1Reviewed,
      surveillanceOutcome: surveillanceOutcomes.find((v) => v.name === formik.values.surveillanceOutcome),
      surveillanceOutcomeOther: formik.values.surveillanceOutcomeOther,
      surveillanceProcessTypes: formik.values.surveillanceProcessTypes,
      surveillanceProcessTypeOther: formik.values.surveillanceProcessTypeOther,
      surveillanceGroundsForInitiating: formik.values.surveillanceGroundsForInitiating,
      surveillanceGroundsForInitiatingOther: formik.values.surveillanceGroundsForInitiatingOther,
      nonconformityCauses: formik.values.nonconformityCauses,
      nonconformityNature: formik.values.nonconformityNature,
      stepsToSurveil: formik.values.stepsToSurveil,
      stepsToEngage: formik.values.stepsToEngage,
      additionalCostsEvaluation: formik.values.additionalCostsEvaluation,
      limitationsEvaluation: formik.values.limitationsEvaluation,
      nondisclosureEvaluation: formik.values.nondisclosureEvaluation,
      directionDeveloperResolution: formik.values.directionDeveloperResolution,
      capStatuses: formik.values.capStatuses,
      capStatusOther: formik.values.capStatusOther,
      surveillanceFindings: formik.values.surveillanceFindings,
    };
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
      k1Reviewed: !!surveillance.k1Reviewed,
      surveillanceOutcome: surveillance.surveillanceOutcome?.name || '',
      surveillanceOutcomeOther: surveillance.surveillanceOutcomeOther || '',
      surveillanceProcessTypes: [],
      surveillanceProcessTypeOther: surveillance.surveillanceProcessTypeOther || '',
      surveillanceGroundsForInitiating: [],
      surveillanceGroundsForInitiatingOther: surveillance.surveillanceGroundsForInitiatingOther || '',
      nonconformityCauses: surveillance.nonconformityCauses || '',
      nonconformityNature: surveillance.nonconformityNature || '',
      stepsToSurveil: surveillance.stepsToSurveil || '',
      stepsToEngage: surveillance.stepsToEngage || '',
      additionalCostsEvaluation: surveillance.additionalCostsEvaluation || '',
      limitationsEvaluation: surveillance.limitationsEvaluation || '',
      nondisclosureEvaluation: surveillance.nondisclosureEvaluation || '',
      directionDeveloperResolution: surveillance.directionDeveloperResolution || '',
      capStatuses: [],
      capStatusOther: surveillance.capStatusOther || '',
      surveillanceFindings: surveillance.surveillanceFindings || '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  if (capStatusesIsLoading || surveillanceGroundsForInitiatingIsLoading || surveillanceOutcomesIsLoading || surveillanceProcessTypesIsLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <FormControlLabel
        control={(
          <Switch
            id="k1-reviewed"
            name="k1Reviewed"
            color="primary"
            checked={formik.values.k1Reviewed}
            onChange={formik.handleChange}
          />
        )}
        label={`§170.523(k)(1) Reviewed: ${formik.values.k1Reviewed ? 'Yes' : 'No'}`}
      />
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
          <MenuItem value={item.name} key={item.id}>{item.name}</MenuItem>
        ))}
      </ChplTextField>
      { formik.values.surveillanceOutcome === 'Non-conformity substantiated - Unresolved - Other - [Please describe]'
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
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Surveillance Process Type</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          Select all activities that were conducted as part of the process to surveil this listing/developer for potential non-conformities.
        </Typography>
        <ChplTextField
          select
          id="surveillance-process-types"
          name="surveillanceProcessTypes"
          label="Surveillance Process Type"
          value={formik.values.surveillanceProcessTypes}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.surveillanceProcessTypes && !!formik.errors.surveillanceProcessTypes}
          helperText={formik.touched.surveillanceProcessTypes && formik.errors.surveillanceProcessTypes}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => selected
              .map((value) => surveillanceProcessTypes.find((item) => item.id === value.id)?.name)
              .sort((a, b) => (a < b ? -1 : 1))
              .join(', '),
          }}
        >
          { surveillanceProcessTypes.map((item) => (
            <MenuItem key={item.id} value={item}>
              <Checkbox
                size="small"
                variant="outlined"
                color="primary"
                checked={formik.values.surveillanceProcessTypes.some((type) => type.id === item.id)}
              />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </ChplTextField>
      </Box>
      { formik.values.surveillanceProcessTypes.some((s) => s.name === 'Other')
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
              required
              value={formik.values.surveillanceProcessTypeOther}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.surveillanceProcessTypeOther && !!formik.errors.surveillanceProcessTypeOther}
              helperText={formik.touched.surveillanceProcessTypeOther && formik.errors.surveillanceProcessTypeOther}
            />
          </Box>
        )}
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>Grounds For Initiating Surveillance</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          Please select the description to best describe the reasons for initiating surveillance (i.e., the particular facts and circumstances from which a reasonable person would have had grounds to question the continued conformity of the Health IT Module)?
        </Typography>
        <ChplTextField
          select
          id="surveillance-process-types"
          name="surveillanceGroundsForInitiating"
          label="Grounds For Initiating Surveillance"
          value={formik.values.surveillanceGroundsForInitiating}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.surveillanceGroundsForInitiating && !!formik.errors.surveillanceGroundsForInitiating}
          helperText={formik.touched.surveillanceGroundsForInitiating && formik.errors.surveillanceGroundsForInitiating}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => selected
              .map((value) => surveillanceGroundsForInitiating.find((item) => item.id === value.id)?.name)
              .sort((a, b) => (a < b ? -1 : 1))
              .join(', '),
          }}
        >
          { surveillanceGroundsForInitiating.map((item) => (
            <MenuItem key={item.id} value={item}>
              <Checkbox
                size="small"
                variant="outlined"
                color="primary"
                checked={formik.values.surveillanceGroundsForInitiating.some((type) => type.id === item.id)}
              />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </ChplTextField>
      </Box>
      { formik.values.surveillanceGroundsForInitiating.some((s) => s.name === 'Other')
        && (
          <Box className={classes.summaryGroup}>
            <Typography variant="h6" gutterBottom>
              <strong>Grounds For Initiating Surveillance - Other</strong>
            </Typography>
            <ChplTextField
              id="surveillance-grounds-for-initiating-other"
              name="surveillanceGroundsForInitiatingOther"
              label="Grounds For Initiating Surveillance - Other"
              multiline
              required
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
          What were the substantial factors that, in the ONC-ACB&apos;s assessment, caused or contributed to the suspected non-conformity or non-conformities (e.g., implementation problem, user error, limitations on the use of capabilities in the field, a failure to disclose known material information, etc.)?
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
          If a suspected non-conformity resulted from additional types of costs or fees that a user was required to pay in order to implement or use the Health IT Module&apos;s certified capabilities, how did ONC-ACB evaluate that suspected non-conformity?
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
          If a suspected non-conformity resulted from limitations that a user encountered in the course of implementing and using the Health IT Module&apos;s certified capabilities, how did ONC-ACB evaluate that suspected non-conformity?
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
      <Box className={classes.summaryGroup}>
        <Typography variant="h6" gutterBottom>
          <strong>CAP Status</strong>
        </Typography>
        <Typography className={classes.question} variant="body2" gutterBottom>
          Please provide the current status of this listing&apos;s CAP. If a Corrective Action Plan was received, approved and completed, please select all actions to verify that the developer completed all requirements. If no CAP was provided, select &quot;No CAP&quot;.
        </Typography>
        <ChplTextField
          select
          id="cap-statuses"
          name="capStatuses"
          label="CAP Status"
          value={formik.values.capStatuses}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.capStatuses && !!formik.errors.capStatuses}
          helperText={formik.touched.capStatuses && formik.errors.capStatuses}
          SelectProps={{
            multiple: true,
            renderValue: (selected) => selected
              .map((value) => capStatuses.find((item) => item.id === value.id)?.name)
              .sort((a, b) => (a < b ? -1 : 1))
              .join(', '),
          }}
        >
          { capStatuses.map((item) => (
            <MenuItem key={item.id} value={item}>
              <Checkbox
                size="small"
                variant="outlined"
                color="primary"
                checked={formik.values.capStatuses.some((type) => type.id === item.id)}
              />
              <ListItemText primary={item.name} />
            </MenuItem>
          ))}
        </ChplTextField>
      </Box>
      { formik.values.capStatuses.some((s) => s.name === 'Other')
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
              required
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
  reportId: number.isRequired,
  surveillance: object.isRequired,
};
