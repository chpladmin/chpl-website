import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
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
  title: yup.string()
    .required('Title is required'),
  startDateTime: yup.date()
    .required('Start Date is required'),
  endDateTime: yup.date()
    .test('mustBeAfter',
      'End Date must be after Start Date',
      (value, context) => (value >= context.parent.startDateTime))
    .required('End Date is required'),
});

function ChplJobEdit(props) {
  const { job, dispatch } = props;
  const classes = useStyles();

  let formik;

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch('close');
        break;
      case 'delete':
        dispatch('delete');
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  formik = useFormik({
    initialValues: {
      title: job.title || '',
      text: job.text || '',
      startDateTime: job.startDateTime || jsJoda.LocalDateTime.now().truncatedTo(jsJoda.ChronoUnit.MINUTES),
      endDateTime: job.endDateTime || jsJoda.LocalDateTime.now().truncatedTo(jsJoda.ChronoUnit.MINUTES),
      isPublic: job.isPublic || false,
    },
    onSubmit: () => {
      const updated = {
        ...job,
        title: formik.values.title,
        text: formik.values.text,
        startDateTime: formik.values.startDateTime,
        endDateTime: formik.values.endDateTime,
        isPublic: formik.values.isPublic,
      };
      props.dispatch('save', updated);
    },
    validationSchema,
  });

  return (
    <>
      <Card>
        <CardHeader
          className={classes.cardHeader}
          titleTypographyProps={{ variant: 'h6' }}
          title={`${job.id ? 'Edit' : 'Create'} Job`}
        />
        <CardContent className={classes.actionContainer}>
          <ChplTextField
            id="title"
            name="title"
            label="Title"
            className={classes.fullWidth}
            required
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && !!formik.errors.title}
            helperText={formik.touched.title && formik.errors.title}
          />
          <ChplTextField
            id="text"
            name="text"
            label="Text"
            className={classes.fullWidth}
            value={formik.values.text}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.text && !!formik.errors.text}
            helperText={formik.touched.text && formik.errors.text}
          />
          <ChplTextField
            id="start-date-time"
            name="startDateTime"
            label="Start Date"
            type="datetime-local"
            required
            value={formik.values.startDateTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.startDateTime && !!formik.errors.startDateTime}
            helperText={formik.touched.startDateTime && formik.errors.startDateTime}
          />
          <ChplTextField
            id="end-date-time"
            name="endDateTime"
            label="End Date"
            type="datetime-local"
            required
            value={formik.values.endDateTime}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endDateTime && !!formik.errors.endDateTime}
            helperText={formik.touched.endDateTime && formik.errors.endDateTime}
          />
          <FormControlLabel
            control={(
              <Switch
                id="is-public"
                name="isPublic"
                color="primary"
                checked={formik.values.isPublic}
                onChange={formik.handleChange}
                className={classes.fullWidth}
              />
            )}
            label={formik.values.isPublic ? 'Public job' : 'For logged in users only'}
          />
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

export default ChplJobEdit;

ChplJobEdit.propTypes = {
  job: object.isRequired,
  dispatch: func.isRequired,
};
