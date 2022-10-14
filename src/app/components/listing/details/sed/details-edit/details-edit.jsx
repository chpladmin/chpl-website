import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import { arrayOf, func, object } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplUcdProcessEdit from './process-edit';
import ChplUcdProcessesView from './processes-view';

import { useFetchUcdProcesses } from 'api/standards';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';

const validationSchema = yup.object({
  sedReportFileLocation: yup.string()
    .url('Improper format (http://www.example.com)')
    .max(250, 'Field is too long'),
  sedIntendedUserDescription: yup.string(),
  sedTestingEndDay: yup.date(),
});

function ChplSedDetailsEdit(props) {
  const { criteria, dispatch, listing } = props;
  const { data, isLoading, isSuccess } = useFetchUcdProcesses();
  const [activeUcdProcess, setActiveUcdProcess] = useState(undefined);
  const [ucdProcesses, setUcdProcesses] = useState([]);
  const [ucdProcessOptions, setUcdProcessOptions] = useState([]);
  let handleDispatch;
  let formik;

  useEffect(() => {
    if (props.ucdProcesses?.length > 0) {
      setUcdProcesses(props.ucdProcesses);
    };
  }, [props.ucdProcesses]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setUcdProcessOptions(data);
  }, [data, isLoading, isSuccess]);

  const buildPayload = () => ({
    listing: {
      ...listing,
      sedReportFileLocation: formik.values.sedReportFileLocation,
      sedIntendedUserDescription: formik.values.sedIntendedUserDescription,
      sedTestingEndDay: formik.values.sedTestingEndDay,
    },
    ucdProcesses,
  });

  const handleActionBarDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'cancel' });
        break;
      case 'save':
        formik.submitForm();
        break;
      // no default
    }
  };

  handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel ucd process':
        setActiveUcdProcess(undefined);
        break;
      case 'delete':
        setUcdProcesses((previous) => previous.filter((prev) => prev.id !== payload.id));
        setActiveUcdProcess(undefined);
        break;
      case 'edit':
        setActiveUcdProcess(payload);
        break;
      case 'save ucd process':
        setActiveUcdProcess(undefined);
        setUcdProcesses((previous) => previous
                        .filter((prev) => prev.id !== payload.id)
                        .concat(payload));
        break;
      // no default
    }
  };

  const isValid = () => formik.isValid && ucdProcesses.length > 0;

  formik = useFormik({
    initialValues: {
      sedReportFileLocation: props.listing.sedReportFileLocation || '',
      sedIntendedUserDescription: props.listing.sedIntendedUserDescription || '',
      sedTestingEndDay: props.listing.sedTestingEndDay || '',
    },
    onSubmit: () => {
      dispatch({ action: 'save', payload: buildPayload() });
    },
    validationSchema,
  });

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  if (activeUcdProcess) {
    return (
      <ChplUcdProcessEdit
        criteriaOptions={criteria}
        dispatch={handleDispatch}
        ucdProcess={activeUcdProcess}
        ucdProcessOptions={ucdProcessOptions}
      />
    );
  }

  return (
    <>
      <ChplTextField
        id="sed-report-file-location"
        name="sedReportFileLocation"
        label="Full Usability Report"
        value={formik.values.sedReportFileLocation}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.sedReportFileLocation && !!formik.errors.sedReportFileLocation}
        helperText={formik.touched.sedReportFileLocation && formik.errors.sedReportFileLocation}
      />
      <ChplTextField
        id="sed-intended-user-description"
        name="sedIntendedUserDescription"
        label="SED Intended User Description"
        value={formik.values.sedIntendedUserDescription}
        multiline
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.sedIntendedUserDescription && !!formik.errors.sedIntendedUserDescription}
        helperText={formik.touched.sedIntendedUserDescription && formik.errors.sedIntendedUserDescription}
      />
      <ChplTextField
        id="sed-testing-end-day"
        name="sedTestingEndDay"
        label="SED Testing Completion Date"
        type="date"
        value={formik.values.sedTestingEndDay}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.sedTestingEndDay && !!formik.errors.sedTestingEndDay}
        helperText={formik.touched.sedTestingEndDay && formik.errors.sedTestingEndDay}
      />
      <ChplUcdProcessesView
        ucdProcesses={ucdProcesses}
        dispatch={handleDispatch}
      />
      <ChplActionBar
        dispatch={handleActionBarDispatch}
        isDisabled={!isValid()}
      />
    </>
  );
}

export default ChplSedDetailsEdit;

ChplSedDetailsEdit.propTypes = {
  criteria: arrayOf(object).isRequired,
  dispatch: func.isRequired,
  listing: object.isRequired,
  ucdProcesses: arrayOf(object).isRequired,
};
