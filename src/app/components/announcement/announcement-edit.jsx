import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplActionBarConfirmation from 'components/action-bar/action-bar-confirmation';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { UserContext } from 'shared/contexts';
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
  startDate: yup.number()
    .required('Start Date is required'),
  endDate: yup.number()
    .required('End Date is required'),
});

function ChplAnnouncementEdit(props) {
  const { announcement, dispatch } = props;
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const classes = useStyles();

  let formik;

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'cancel':
        props.dispatch('close');
        break;
      case 'delete':
        props.dispatch('delete');
        break;
      case 'save':
        formik.submitForm();
        break;
      default:
        console.log({ action, data });
    }
  };

  formik = useFormik({
    initialValues: {
      title: announcement.title || '',
      text: announcement.text || '',
      startDate: announcement.startDate || Date.now(),
      endDate: announcement.endDate || Date.now(),
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
        <CardHeader className={classes.cardHeader} title="Edit Announcement" />
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
            className={classes.fullWidth}
            required
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
            className={classes.fullWidth}
            required
            value={formik.values.endDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.endDate && !!formik.errors.endDate}
            helperText={formik.touched.endDate && formik.errors.endDate}
          />
          <ChplTextField
            id="is-public"
            name="isPublic"
            label="Is Public?"
            className={classes.fullWidth}
            value={formik.values.isPublic}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.isPublic && !!formik.errors.isPublic}
            helperText={formik.touched.isPublic && formik.errors.isPublic}
          />
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={!formik.isValid || formik.isSubmitting}
        canDelete
      />
    </>
  );
}

export default ChplAnnouncementEdit;

ChplAnnouncementEdit.propTypes = {
  announcement: announcementPropType.isRequired,
  dispatch: func.isRequired,
};
