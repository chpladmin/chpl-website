import React from 'react';
import {
  FormControlLabel,
  FormHelperText,
  Switch,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { jsJoda } from 'services/date-util';
import { announcement as announcementPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  fullWidth: {
    gridColumnStart: '1',
    gridColumnEnd: '-1',
  },
  helperTextSpacing: {
    marginLeft: '14px',
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

function ChplAnnouncementEdit(props) {
  const { announcement, dispatch } = props;
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
      title: announcement.title || '',
      text: announcement.text || '',
      startDateTime: announcement.startDateTime || jsJoda.LocalDateTime.now().truncatedTo(jsJoda.ChronoUnit.MINUTES),
      endDateTime: announcement.endDateTime || jsJoda.LocalDateTime.now().truncatedTo(jsJoda.ChronoUnit.MINUTES),
      isPublic: announcement.isPublic || false,
    },
    onSubmit: () => {
      const updated = {
        ...announcement,
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
      <div>
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
        <FormHelperText className={classes.helperTextSpacing} id="EST-helper-text">All times should be entered as Eastern Time (ET)</FormHelperText>
      </div>
      <div>
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
        <FormHelperText className={classes.helperTextSpacing} id="EST-helper-text">All times should be entered as Eastern Time (ET)</FormHelperText>
      </div>
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
        label={formik.values.isPublic ? 'Public announcement' : 'For logged in users only'}
      />
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={!formik.isValid || formik.isSubmitting}
        canDelete={!!announcement.id}
      />
    </>
  );
}

export default ChplAnnouncementEdit;

ChplAnnouncementEdit.propTypes = {
  announcement: announcementPropType.isRequired,
  dispatch: func.isRequired,
};
