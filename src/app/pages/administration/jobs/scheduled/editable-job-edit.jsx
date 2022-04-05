import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
} from '@material-ui/core';
import { func, object } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import theme from 'themes/theme';

const useStyles = makeStyles({
  actionContainer: {
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
  /*
  title: yup.string()
    .required('Title is required'),
  startDateTime: yup.date()
    .required('Start Date is required'),
  endDateTime: yup.date()
    .test('mustBeAfter',
      'End Date must be after Start Date',
      (value, context) => (value >= context.parent.startDateTime))
    .required('End Date is required'),
    */
});

function ChplEditableJobEdit(props) {
  const { job, dispatch } = props;
  const classes = useStyles();

  let formik;

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({action: 'close'});
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
          title={`Edit Job: ${job.name}`}
        />
        <CardContent className={classes.actionContainer}>
          Job Name
          { job.name }
          Job Description
          { job.description }
          Subscribers
          <ul>
            <li>tbd <Button /></li>
          </ul>
          <ChplTextField
            id="email"
            name="email"
            label="Email"
            className={classes.fullWidth}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />
          <Button />
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={!formik.isValid || formik.isSubmitting}
      />
    </>
  );
}

export default ChplEditableJobEdit;

ChplEditableJobEdit.propTypes = {
  job: object.isRequired,
  dispatch: func.isRequired,
};
