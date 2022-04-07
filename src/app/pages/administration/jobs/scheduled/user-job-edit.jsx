import React, { useEffect, useState } from 'react';
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

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { jobType } from 'shared/prop-types';
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
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid email'),
});

function ChplUserJobEdit(props) {
  const { dispatch } = props;
  const [job, setJob] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setJob(props.job);
  }, [props.job]); // eslint-disable-line react/destructuring-assignment

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'close' });
        break;
      case 'delete':
        dispatch({ action: 'delete' });
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: () => {
      const payload = {
        ...job,
        jobDataMap: {
          ...job.jobDataMap,
        },
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
          title={`${job.id ? 'Edit' : 'Create'} Job: ${job.name}`}
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
            id="email"
            name="email"
            label="Email"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Typography>
            ACB
          </Typography>
          <Typography>
            Schedule
          </Typography>
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={!formik.isValid || formik.isSubmitting}
        canDelete={!!job.id}
      />
    </>
  );
}

export default ChplUserJobEdit;

ChplUserJobEdit.propTypes = {
  job: jobType.isRequired,
  dispatch: func.isRequired,
};
