import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import {
  func, number, object, oneOfType, string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import DeleteIcon from '@material-ui/icons/Delete';

import { useFetchNonConformityTypes } from 'api/data';
import { ChplTextField, ChplTooltip } from 'components/util';
import { sortNonconformityTypes } from 'services/surveillance.service';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  nonConformityCard: {
    marginBottom: '8px',
  },
});

const validationSchema = yup.object({
  capApprovalDay: yup.date(),
  capEndDay: yup.date(),
  capMustCompleteDay: yup.date(),
  capStartDay: yup.date(),
  dateOfDeterminationDay: yup.date()
    .required('Date of Determination is required'),
  developerExplanation: yup.string(),
  findings: yup.string()
    .required('Findings is required'),
  nonconformityCloseDay: yup.date(),
  nonconformityStatus: yup.string(),
  resolution: yup.string()
    .when('nonconformityCloseDay', {
      is: (val) => !!val,
      then: yup.string()
        .required('Resolution is required'),
    }),
  sitesPassed: yup.number()
    .when('randomizedSitesUsed', {
      is: (val) => val > 0,
      then: yup.number()
        .required('Sites Passed is required')
        .min(0, 'Sites Passed must be greater than or equal to 0')
        .max(yup.ref('totalSites'), 'Sites Passed must be less than or equal to Total Sites Used'),
    }),
  summary: yup.string()
    .required('Summary is required'),
  totalSites: yup.number()
    .when('randomizedSitesUsed', {
      is: (val) => val > 0,
      then: yup.number()
        .required('Total Sites is required')
        .min(0, 'Total Sites must be greater than or equal to 0')
        .max(yup.ref('randomizedSitesUsed'), 'Total Sites must be less than or equal to Randomized Sites Used'),
    }),
  type: yup.string()
    .required('Non-Conformity Type is required'),
});

function ChplNonConformityEdit({
  nonConformity, dispatch, guid, randomizedSitesUsed,
}) {
  const { data, isLoading, isError } = useFetchNonConformityTypes();
  const [nonConformityTypes, setNonConformityTypes] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (isLoading || isError) { return; }
    setNonConformityTypes(data.sort(sortNonconformityTypes));
  }, [data, isLoading, isError]);

  useEffect(() => {
    formik.setFieldValue('randomizedSitesUsed', typeof (randomizedSitesUsed) === 'string' ? 0 : randomizedSitesUsed);
  }, [randomizedSitesUsed]);

  const handleChange = (e) => {
    formik.handleChange(e);
    const nc = {
      ...nonConformity,
      capApprovalDay: e.target.name === 'capApprovalDay' ? e.target.value : formik.values.capApprovalDay,
      capEndDay: e.target.name === 'capEndDay' ? e.target.value : formik.values.capEndDay,
      capMustCompleteDay: e.target.name === 'capMustCompleteDay' ? e.target.value : formik.values.capMustCompleteDay,
      capStartDay: e.target.name === 'capStartDay' ? e.target.value : formik.values.capStartDay,
      dateOfDeterminationDay: e.target.name === 'dateOfDeterminationDay' ? e.target.value : formik.values.dateOfDeterminationDay,
      developerExplanation: e.target.name === 'developerExplanation' ? e.target.value : formik.values.developerExplanation,
      findings: e.target.name === 'findings' ? e.target.value : formik.values.findings,
      guid,
      nonconformityCloseDay: e.target.name === 'nonconformityCloseDay' ? e.target.value : formik.values.nonconformityCloseDay,
      nonconformityStatus: e.target.name === 'nonconformityStatus' ? e.target.value : formik.values.nonconformityStatus,
      resolution: e.target.name === 'resolution' ? e.target.value : formik.values.resolution,
      sitesPassed: e.target.name === 'sitesPassed' ? e.target.value : formik.values.sitesPassed,
      summary: e.target.name === 'summary' ? e.target.value : formik.values.summary,
      totalSites: e.target.name === 'totalSites' ? e.target.value : formik.values.totalSites,
      type: nonConformityTypes.find((t) => t.id === (e.target.name === 'type' ? e.target.value : formik.values.type)),
    };
    dispatch({ action: 'update-nc', payload: nc });
  };

  const remove = () => {
    dispatch({ action: 'remove-nc', payload: guid });
  };

  formik = useFormik({
    initialValues: {
      randomizedSitesUsed: typeof (randomizedSitesUsed) === 'string' ? 0 : randomizedSitesUsed,
      capApprovalDay: nonConformity.capApprovalDay ?? '',
      capEndDay: nonConformity.capEndDay ?? '',
      capMustCompleteDay: nonConformity.capMustCompleteDay ?? '',
      capStartDay: nonConformity.capStartDay ?? '',
      dateOfDeterminationDay: nonConformity.dateOfDeterminationDay ?? '',
      developerExplanation: nonConformity.developerExplanation ?? '',
      findings: nonConformity.findings ?? '',
      nonconformityCloseDay: nonConformity.nonconformityCloseDay ?? '',
      nonconformityStatus: nonConformity.nonconformityStatus ?? '',
      resolution: nonConformity.resolution ?? '',
      sitesPassed: nonConformity.sitesPassed ?? '',
      summary: nonConformity.summary ?? '',
      totalSites: nonConformity.totalSites ?? '',
      type: nonConformity.type?.id ?? '',
    },
    validationSchema,
  });

  if (nonConformityTypes.length === 0) { return <CircularProgress />; }

  return (
    <>
      <Card className={classes.nonConformityCard}>
        <CardHeader
          title="Non-Conformity"
          action={(
            <ChplTooltip placement="left" title="Remove Non-Conformity">
              <IconButton onClick={remove}>
                <DeleteIcon color="error" />
              </IconButton>
            </ChplTooltip>
        )}
        />
        <CardContent>
          <Box display="flex" gridGap="16px" flexDirection="column" justifyContent="space-between" pb={2}>
            <Box display="flex" gridGap="16px" flexDirection="row">
              <ChplTextField
                select
                id="type"
                name="type"
                label="Non-Conformity Type"
                required
                value={formik.values.type}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.type && !!formik.errors.type}
                helperText={formik.touched.type && formik.errors.type}
              >
                { nonConformityTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.status === 'REMOVED' ? 'Removed | ' : ''}
                    {type.status === 'RETIRED' ? 'Retired | ' : ''}
                    {type.number ? (`${type.number}: `) : ''}
                    {type.title}
                  </MenuItem>
                ))}
              </ChplTextField>
            </Box>
            <Box display="flex" gridGap="16px" flexDirection="row">
              <ChplTextField
                type="date"
                id="date-of-determination"
                name="dateOfDeterminationDay"
                label="Date of Determination"
                required
                value={formik.values.dateOfDeterminationDay}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dateOfDeterminationDay && !!formik.errors.dateOfDeterminationDay}
                helperText={formik.touched.dateOfDeterminationDay && formik.errors.dateOfDeterminationDay}
              />

              <ChplTextField
                type="date"
                id="cap-approval-day"
                name="capApprovalDay"
                label="Corrective Action Plan Approval Date"
                value={formik.values.capApprovalDay}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.capApprovalDay && !!formik.errors.capApprovalDay}
                helperText={formik.touched.capApprovalDay && formik.errors.capApprovalDay}
              />
            </Box>
            <Box display="flex" gridGap="16px" flexDirection="row">
              <ChplTextField
                type="date"
                id="cap-start-day"
                name="capStartDay"
                label="Corrective Action Plan Start Date"
                value={formik.values.capStartDay}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.capStartDay && !!formik.errors.capStartDay}
                helperText={formik.touched.capStartDay && formik.errors.capStartDay}
              />
              <ChplTextField
                type="date"
                id="cap-end-day"
                name="capEndDay"
                label="Corrective Action Plan End Date"
                value={formik.values.capEndDay}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.capEndDay && !!formik.errors.capEndDay}
                helperText={formik.touched.capEndDay && formik.errors.capEndDay}
              />
            </Box>
            <Box display="flex" gridGap="16px" flexDirection="row">
              <ChplTextField
                type="date"
                id="cap-must-complete-day"
                name="capMustCompleteDay"
                label="Corrective Action Plan Must Complete Date"
                value={formik.values.capMustCompleteDay}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.capMustCompleteDay && !!formik.errors.capMustCompleteDay}
                helperText={formik.touched.capMustCompleteDay && formik.errors.capMustCompleteDay}
              />
              <ChplTextField
                type="date"
                id="non-conformity-close-day"
                name="nonconformityCloseDay"
                label="Non-Conformity Close Date"
                value={formik.values.nonconformityCloseDay}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.nonconformityCloseDay && !!formik.errors.nonconformityCloseDay}
                helperText={formik.touched.nonconformityCloseDay && formik.errors.nonconformityCloseDay}
              />
            </Box>
            <Box display="flex" gridGap="16px" flexDirection="row">
              <ChplTextField
                type="number"
                id="sites-passed"
                name="sitesPassed"
                label="Number of Sites Passed"
                required={formik.values.randomizedSitesUsed > 0}
                disabled={formik.values.randomizedSitesUsed === 0}
                value={formik.values.sitesPassed}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.sitesPassed && !!formik.errors.sitesPassed}
                helperText={formik.touched.sitesPassed && formik.errors.sitesPassed}
              />
              <ChplTextField
                type="number"
                id="total-sites"
                name="totalSites"
                label="Total Sites"
                required={formik.values.randomizedSitesUsed > 0}
                disabled={formik.values.randomizedSitesUsed === 0}
                value={formik.values.totalSites}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.totalSites && !!formik.errors.totalSites}
                helperText={formik.touched.totalSites && formik.errors.totalSites}
              />
            </Box>
            <Box display="flex" gridGap="16px" flexDirection="column">
              <ChplTextField
                id="summary"
                name="summary"
                label="Summary"
                required
                value={formik.values.summary}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.summary && !!formik.errors.summary}
                helperText={formik.touched.summary && formik.errors.summary}
              />
              <ChplTextField
                id="findings"
                name="findings"
                label="Findings"
                multiline
                required
                value={formik.values.findings}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.findings && !!formik.errors.findings}
                helperText={formik.touched.findings && formik.errors.findings}
              />
            </Box>
            <Box display="flex" gridGap="16px" flexDirection="column">
              <ChplTextField
                id="developer-explanation"
                name="developerExplanation"
                label="Developer Explanation"
                multiline
                value={formik.values.developerExplanation}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.developerExplanation && !!formik.errors.developerExplanation}
                helperText={formik.touched.developerExplanation && formik.errors.developerExplanation}
              />
              <ChplTextField
                id="resolution"
                name="resolution"
                label="Resolution"
                multiline
                required={!!formik.values.nonconformityCloseDay}
                value={formik.values.resolution}
                onChange={handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.resolution && !!formik.errors.resolution}
                helperText={formik.touched.resolution && formik.errors.resolution}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default ChplNonConformityEdit;

ChplNonConformityEdit.propTypes = {
  nonConformity: object.isRequired,
  dispatch: func.isRequired,
  guid: number.isRequired,
  randomizedSitesUsed: oneOfType([number, string]).isRequired,
};
