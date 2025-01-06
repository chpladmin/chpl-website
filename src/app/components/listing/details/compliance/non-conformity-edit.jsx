import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  List,
  ListItem,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { func, number, object } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchNonConformityTypes } from 'api/data';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useAnalyticsContext } from 'shared/contexts';
import { surveillance as surveillancePropType } from 'shared/prop-types';
import { getRequirementDisplay, sortRequirements, sortRequirementTypes } from 'services/surveillance.service';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

const validationSchema = yup.object({
  capApprovalDay: yup.date(),
  capEndDay: yup.date(),
  capMustCompleteDay: yup.date(),
  capStartDay: yup.date(),
  dateOfDeterminationDay: yup.date(),
  developerExplanation: yup.string(),
  findings: yup.string(),
  nonconformityCloseDay: yup.date(),
  nonconformityStatus: yup.string(),
  resolution: yup.string(),
  sitesPassed: yup.number(),
  summary: yup.string(),
  totalSites: yup.number,
  type: yup.string(),
/*
  requirementGroupType: yup.string()
    .required('Requirement Type is required'),
  requirementType: yup.string()
    .required('Requirement is required'),
  requirementTypeOther: yup.string()
    .when('requirementType', {
      is: 'Other',
      then: yup.string()
        .required('Requirement Type - Other is required'),
    }),
  result: yup.string()
    .required('Result is required'),
    */
});

function ChplNonConformityEdit({ nonConformity, dispatch, guid }) {
  const { data, isLoading, isError } = useFetchNonconformityTypes();
  const [nonConformityTypes, setNonConformityTypes] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (isLoading || isError) { return; }
    setNonConformityTypes(data.sort((a, b) => a.name.localeCompare(b.name)));
  }, [data, isLoading, isError]);

  const handleDispatch = (action) => {
    dispatch({ action });
  };

  formik = useFormik({
    initialValues: {
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
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  if (requirementGroupTypes.length === 0 || requirementTypes.length === 0 || resultTypes.length === 0) { return <CircularProgress />; }

  return (
    <>
      <Card>
        <CardHeader title="Non-Conformity" />
        <CardContent>
          <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between" pb={2}>
            <ChplTextField
              select
              id="requirement-group-type"
              name="requirementGroupType"
              label="Requirement Type"
              required
              value={formik.values.requirementGroupType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.requirementGroupType && !!formik.errors.requirementGroupType}
              helperText={formik.touched.requirementGroupType && formik.errors.requirementGroupType}
            >
              { requirementGroupTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
              ))}
            </ChplTextField>
            <ChplTextField
              select
              id="requirement-type"
              name="requirementType"
              label="Requirement"
              required={formik.values.requirementGroupType !== 'Other Requirement'}
              disabled={formik.values.requirementGroupType === 'Other Requirement'}
              value={formik.values.requirementType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.requirementType && !!formik.errors.requirementType}
              helperText={formik.touched.requirementType && formik.errors.requirementType}
            >
              { requirementTypes
                .filter(isRequirementAvailable)
                .sort(sortRequirementTypes)
                .map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.status === 'REMOVED' ? 'Removed | ' : ''}
                    {type.status === 'RETIRED' ? 'Retired | ' : ''}
                    {type.number ? (`${type.number}: `) : ''}
                    {type.title}
                  </MenuItem>
                ))}
            </ChplTextField>
            <ChplTextField
              type="text"
              id="requirement-type-other"
              name="requirementTypeOther"
              label="Requirement Type - Other"
              required={formik.values.requirementGroupType === 'Other Requirement'}
              disabled={formik.values.requirementGroupType !== 'Other Requirement'}
              value={formik.values.requirementTypeOther}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.requirementTypeOther && !!formik.errors.requirementTypeOther}
              helperText={formik.touched.requirementTypeOther && formik.errors.requirementTypeOther}
            />
            <ChplTextField
              select
              id="result"
              name="result"
              label="Result"
              required
              value={formik.values.result}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.result && !!formik.errors.result}
              helperText={formik.touched.result && formik.errors.result}
            >
              { resultTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
              ))}
            </ChplTextField>
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
};
