import React, { useContext, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  FormHelperText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import * as jsJoda from '@js-joda/core';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { BreadcrumbContext } from 'shared/contexts';
import { job as jobType } from 'shared/prop-types';

const useStyles = makeStyles({
  helperTextSpacing: {
    marginLeft: '14px',
  },
  subHeaderColor: {
    color: '#000000',
  },
});

const validationSchema = yup.object({
  runTime: yup.date()
    .required('Run Time is required'),
});

function ChplSystemTriggerCreate(props) {
  const { job, dispatch } = props;
  const { append, display, hide } = useContext(BreadcrumbContext);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    append(
      <Button
        key="systemJobs.schedule.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Schedule
      </Button>,
    );
    display('systemJobs.schedule.disabled');
  }, []);

  const handleDispatch = (action) => {
    hide('systemJobs.schedule.disabled');
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
          titleTypographyProps={{ gutterBottom: true, variant: 'h5' }}
          title={`Run Job: ${job.name}`}
          subheader={(
            <Typography className={classes.subHeaderColor} variant="body1">
              {job.description}
            </Typography>
          )}
        />
        <CardContent>
          <Card>
            <CardContent>
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
              <FormHelperText className={classes.helperTextSpacing}>All times should be entered as Eastern Time (ET)</FormHelperText>
            </CardContent>
          </Card>
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
