import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import {
  func, number, object, oneOfType, string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplNonConformityEdit from './non-conformity-edit';

import {
  useFetchRequirementGroupTypes,
  useFetchRequirementTypes,
  useFetchSurveillanceResultTypes,
} from 'api/data';
import { ChplTextField } from 'components/util';
import { getRequirementDisplay, sortRequirementTypes } from 'services/surveillance.service';
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

function ChplRequirementEdit({
  requirement, dispatch, guid, randomizedSitesUsed,
}) {
  const groupTypeQuery = useFetchRequirementGroupTypes();
  const typeQuery = useFetchRequirementTypes();
  const resultQuery = useFetchSurveillanceResultTypes();
  const [nonConformities, setNonConformities] = useState([]);
  const [requirementGroupTypes, setRequirementGroupTypes] = useState([]);
  const [requirementTypes, setRequirementTypes] = useState([]);
  const [resultTypes, setResultTypes] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (requirement.nonconformities) {
      setNonConformities(requirement.nonconformities.map((nc, idx) => ({
        ...nc,
        guid: nc.id ?? idx,
      })));
    }
  }, []);

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

  const addNc = () => {
    setNonConformities((prev) => prev.concat({ guid: Date.now() }));
  };

  const isRequirementAvailable = (type) => type.requirementGroupType.name === formik.values.requirementGroupType;

  const handleChange = (e) => {
    if (e.target.name === 'requirementGroupType') {
      formik.setFieldValue('requirementType', '');
    }
    formik.handleChange(e);
    const req = {
      ...requirement,
      guid,
      requirementGroupType: requirementGroupTypes.find((t) => t.name === (e.target.name === 'requirementGroupType' ? e.target.value : formik.values.requirementGroupType)),
      requirementType: requirementTypes.find((t) => t.id === (e.target.name === 'requirementType' ? e.target.value : formik.values.requirementType)),
      requirementTypeOther: e.target.name === 'requirementTypeOther' ? e.target.value : formik.values.requirementTypeOther,
      result: resultTypes.find((t) => t.id === (e.target.name === 'result' ? e.target.value : formik.values.result)),
    };
    dispatch({ action: 'update-req', payload: req });
  };

  const handleDispatch = ({ action, payload }) => {
    let updated;
    switch (action) {
      case 'remove-nc':
        setNonConformities((prev) => prev.filter((nc) => nc.guid !== payload));
        updated = {
          ...requirement,
          guid,
          nonconformities: nonConformities,
        };
        dispatch({ action: 'update-req', payload: updated });
        break;
      case 'update-nc':
        updated = {
          ...requirement,
          guid,
          nonconformities: nonConformities.map((nc) => (nc.guid === payload.guid ? payload : nc)),
        };
        dispatch({ action: 'update-req', payload: updated });
        break;
      default:
        console.log('req-edit', action, payload);
        dispatch({ action, payload });
    }
  };

  const remove = () => {
    dispatch({ action: 'remove-req', payload: guid });
  };

  formik = useFormik({
    initialValues: {
      requirementGroupType: requirement.requirementType?.requirementGroupType.name ?? '',
      requirementType: requirement.requirementType?.id ?? '',
      requirementTypeOther: requirement.requirementTypeOther ?? '',
      result: requirement.result?.id ?? '',
    },
    validationSchema,
  });

  if (requirementGroupTypes.length === 0 || requirementTypes.length === 0 || resultTypes.length === 0) { return <CircularProgress />; }

  return (
    <>
      <Card>
        <CardHeader title={'Requirement: ' + getRequirementDisplay(requirement)} />
        <CardContent>
          <Button
            onClick={remove}
          >
            Remove Requirement
          </Button>
          <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between" pb={2}>
            <ChplTextField
              select
              id="requirement-group-type"
              name="requirementGroupType"
              label="Requirement Type"
              required
              value={formik.values.requirementGroupType}
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
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
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.result && !!formik.errors.result}
              helperText={formik.touched.result && formik.errors.result}
            >
              { resultTypes.map((type) => (
                <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
              ))}
            </ChplTextField>
          </Box>
          <Button
            onClick={addNc}
          >
            Add Non-Conformity
          </Button>
          { nonConformities.map((nc) => (
            <ChplNonConformityEdit
              key={nc.guid}
              nonConformity={nc}
              dispatch={handleDispatch}
              guid={nc.guid}
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
