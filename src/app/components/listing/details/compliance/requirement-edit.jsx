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
import { func, number, object, oneOfType, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplNonConformityEdit from './non-conformity-edit';

import {
  useFetchRequirementGroupTypes,
  useFetchRequirementTypes,
  useFetchSurveillanceResultTypes,
} from 'api/data';
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
});

function ChplRequirementEdit({ requirement, dispatch, guid, randomizedSitesUsed }) {
  const groupTypeQuery = useFetchRequirementGroupTypes();
  const typeQuery = useFetchRequirementTypes();
  const resultQuery = useFetchSurveillanceResultTypes();
  const [requirementGroupTypes, setRequirementGroupTypes] = useState([]);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [resultTypes, setResultTypes] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (groupTypeQuery.isLoading || groupTypeQuery.isError) { return; }
    setRequirementGroupTypes(groupTypeQuery.data.sort((a, b) => a.name.localeCompare(b.name)));
  }, [groupTypeQuery.data, groupTypeQuery.isLoading, groupTypeQuery.isError]);

  useEffect(() => {
    if (typeQuery.isLoading || typeQuery.isError) { return; }
    setRequirementTypes(typeQuery.data.sort((a, b) => a.title.localeCompare(b.title)));
  }, [typeQuery.data, typeQuery.isLoading, typeQuery.isError]);

  useEffect(() => {
    if (resultQuery.isLoading || resultQuery.isError) { return; }
    setResultTypes(resultQuery.data.sort((a, b) => a.name.localeCompare(b.name)));
  }, [resultQuery.data, resultQuery.isLoading, resultQuery.isError]);

  const isRequirementAvailable = (type) => {
    return type.requirementGroupType.name === formik.values.requirementGroupType;
  };

  const handleDispatch = ({ action, payload }) => {
    console.log('req-edit', action, payload);
    dispatch({ action, payload });
  };

  formik = useFormik({
    initialValues: {
      requirementGroupType: requirement.requirementType?.requirementGroupType.name ?? '',
      requirementType: requirement.requirementType?.id ?? '',
      requirementTypeOther: requirement.requirementTypeOther ?? '',
      result: requirement.result?.name ?? '',
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
        <CardHeader title="Requirement" />
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
          { requirement.nonconformities?.map((nc) => (
            <ChplNonConformityEdit
              key={nc.id ?? Date.now()}
              nonConformity={nc}
              dispatch={handleDispatch}
              guid={nc.id ?? Date.now()}
              randomizedSitesUsed={randomizedSitesUsed}
            />
          ))}
        </CardContent>
      </Card>
    </>
  );
}

export default ChplRequirementEdit;

ChplRequirementEdit.propTypes = {
  requirement: object.isRequired,
  dispatch: func.isRequired,
  guid: number.isRequired,
  randomizedSitesUsed: oneOfType([number, string]).isRequired,
};
