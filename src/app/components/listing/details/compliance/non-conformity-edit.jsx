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
import { getRequirementDisplay, sortNonconformityTypes, sortRequirements, sortRequirementTypes } from 'services/surveillance.service';
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
  totalSites: yup.number(),
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
  const { data, isLoading, isError } = useFetchNonConformityTypes();
  const [nonConformityTypes, setNonConformityTypes] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (isLoading || isError) { return; }
    setNonConformityTypes(data.sort(sortNonconformityTypes));
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

  if (nonConformityTypes.length === 0) { return <CircularProgress />; }

  return (
    <>
      <Card>
        <CardHeader title="Non-Conformity" />
        <CardContent>
          <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between" pb={2}>
            <ChplTextField
              select
              id="non-conformity-type"
              name="nonConformityType"
              label="Non-Conformity Type"
              required
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.type && !!formik.errors.type}
              helperText={formik.touched.type && formik.errors.type}
            >
              { nonConformityTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.status === 'REMOVED' ? 'Removed | ' : ''}
                  {type.status === 'RETIRED' ? 'Retired | ' : ''}
                  {type.number ? (type.number + ': ') : ''}
                  {type.title}
                </MenuItem>
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
