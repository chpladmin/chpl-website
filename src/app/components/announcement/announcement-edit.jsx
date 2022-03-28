import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { announcement as announcementPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  actionContainer: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto 1fr',
    },
  },
  actionSubContainer: {
    display: 'grid',
    gap: '16px',
    alignContent: 'flex-start',
    gridTemplateColumns: '1fr 1fr',
  },
  actionDivider: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'inline',
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
  startDate: yup.date()
    .required('Start Date is required'),
  endDate: yup.date()
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
      startDate: (new Date(announcement.startDate || Date.now())).toISOString().substring(0, 19),
      endDate: (new Date(announcement.endDate || Date.now())).toISOString().substring(0, 19),
      isPublic: announcement.isPublic || false,
    },
    onSubmit: () => {
      const updated = {
        ...announcement,
        title: formik.values.title,
        text: formik.values.text,
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
        isPublic: formik.values.isPublic,
      };
      props.dispatch('save', updated);
    },
    validationSchema,
  });

  return (
    <>
      <Card>
        <CardHeader className={classes.cardHeader} title={`${announcement.id ? 'Edit' : 'Create'} Announcement`} />
        <CardContent>
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
            id="start-date"
            name="startDate"
            label="Start Date"
            type="datetime-local"
            required
            className={classes.fullWidth}
            value={formik.values.startDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.startDate && !!formik.errors.startDate}
            helperText={formik.touched.startDate && formik.errors.startDate}
          />
          <ChplTextField
            id="end-date"
            name="endDate"
            label="End Date"
            type="datetime-local"
            required
            className={classes.fullWidth}
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endDate && !!formik.errors.endDate}
            helperText={formik.touched.endDate && formik.errors.endDate}
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
            label="Is Public?"
          />
        </CardContent>
      </Card>
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
