import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplUcdProcessEdit from './process-edit';
import ChplUcdProcessesView from './processes-view';

import { useFetchUcdProcesses } from 'api/standards';
import { ChplTextField } from 'components/util';
import { criterion, listing as listingPropType, ucdProcessType as ucdProcessPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cardActionSpacing : {
    padding: '16px',
  },
});

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
  let formik;
  const classes = useStyles();

  useEffect(() => {
    if (props.ucdProcesses?.length > 0) {
      setUcdProcesses(props.ucdProcesses);
    }
  }, [props.ucdProcesses]); // eslint-disable-line react/destructuring-assignment

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

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'cancel':
        setActiveUcdProcess(undefined);
        break;
      case 'delete':
        setUcdProcesses((previous) => previous.filter((prev) => prev.id !== payload.id));
        setActiveUcdProcess(undefined);
        break;
      case 'edit':
        setActiveUcdProcess(payload);
        break;
      case 'save':
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
      sedReportFileLocation: listing.sedReportFileLocation || '',
      sedIntendedUserDescription: listing.sedIntendedUserDescription || '',
      sedTestingEndDay: listing.sedTestingEndDay || '',
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
    <Card>
    <CardContent className={classes.container}>
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
      </CardContent>
      <CardActions className={classes.cardActionSpacing}>
        <ButtonGroup>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => dispatch({ action: 'cancel' })}
          endIcon={<CloseOutlinedIcon />}
          >
          Cancel
        </Button>
        <Button
          color="primary"
          variant="contained"
          endIcon={<CheckOutlinedIcon />}
          onClick={() => formik.submitForm()}
          disabled={!isValid()}
          >
          Accept
        </Button>
        </ButtonGroup>
      </CardActions>
    </Card>
  );
}

export default ChplSedDetailsEdit;

ChplSedDetailsEdit.propTypes = {
  criteria: arrayOf(criterion).isRequired,
  dispatch: func.isRequired,
  listing: listingPropType.isRequired,
  ucdProcesses: arrayOf(ucdProcessPropType).isRequired,
};
