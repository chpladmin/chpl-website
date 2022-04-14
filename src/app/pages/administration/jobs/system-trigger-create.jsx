import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as jsJoda from '@js-joda/core';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { job as jobType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  fullWidth: {
    gridColumnStart: '1',
    gridColumnEnd: '-1',
  },
});

const validationSchema = yup.object({
  runTime: yup.date()
    .required('Run Time is required'),
});

function ChplSystemTriggerCreate(props) {
  const { job, dispatch } = props;
  const classes = useStyles();

  let formik;

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'close' });
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  formik = useFormik({
    initialValues: {
      runTime: jsJoda.LocalDateTime
        .now()
        .plusMinutes(5)
        .truncatedTo(jsJoda.ChronoUnit.MINUTES),
    },
    onSubmit: () => {
      const payload = {
        ...job,
        runTime: formik.values.runTime,
      };
      props.dispatch({ action: 'save', payload });
    },
    validationSchema,
  });

  return (
    <>
      <Card>
        <CardHeader
          className={classes.cardHeader}
          titleTypographyProps={{ variant: 'h6' }}
          title={`Run Job: ${job.name}`}
        />
        <CardContent className={classes.container}>
          <Typography>
            Job Name
            <br />
            { job.name }
          </Typography>
          <Typography>
            Job Description
            <br />
            { job.description }
          </Typography>
          <ChplTextField
            id="run-time"
            name="runTime"
            label="Run Time"
            type="datetime-local"
            required
            value={formik.values.runTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.runTime && !!formik.errors.runTime}
            helperText={formik.touched.runTime && formik.errors.runTime}
          />
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={!formik.isValid}
      />
    </>
  );
}

export default ChplSystemTriggerCreate;

ChplSystemTriggerCreate.propTypes = {
  job: jobType.isRequired,
  dispatch: func.isRequired,
};
