import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmailIcon from '@material-ui/icons/Email';
import { arrayOf, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplDialogTitle, ChplTooltip, ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
});

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid Email'),
  role: yup.string()
    .required('A ROLE must be selected'),
});

function ChplUserInvite({ dispatch, roles }) {
  const { analytics } = useAnalyticsContext();
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  let formik;

  const handleClickOpen = () => {
    eventTrack({
      ...analytics,
      event: 'Open Invite User',
    });
    setOpen(true);
  };

  const handleClose = () => {
    formik.resetForm();
    eventTrack({
      ...analytics,
      event: 'Close Invite User',
    });
    setOpen(false);
  };

  const invite = () => {
    const invitation = {
      email: formik.values.email,
      role: formik.values.role,
    };
    dispatch('invite', invitation);
    handleClose();
  };

  formik = useFormik({
    initialValues: {
      email: '',
      role: roles.length > 1 ? '' : roles[0],
    },
    onSubmit: () => {
      invite();
    },
    validationSchema,
  });

  return (
    <>
      <ChplTooltip title="Invite a User">
        <Button
          id="invite-user-button"
          aria-label="Open User Invitation dialog"
          color="primary"
          variant="outlined"
          onClick={handleClickOpen}
        >
          <PersonAddIcon />
        </Button>
      </ChplTooltip>
      <Dialog
        fullWidth
        maxWidth="md"
        onClose={handleClose}
        aria-labelledby="user-invitation-title"
        open={open}
      >
        <ChplDialogTitle
          id="user-invitation-title"
          onClose={handleClose}
        >
          Invite a User
        </ChplDialogTitle>
        <DialogContent
          dividers
          className={classes.content}
        >
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
          { roles.length > 1
            && (
              <ChplTextField
                select
                id="role"
                name="role"
                label="ROLE"
                required
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.role && !!formik.errors.role}
                helperText={formik.touched.role && formik.errors.role}
              >
                { roles
                  .sort((a, b) => (a < b ? -1 : 1))
                  .map((item) => (
                    <MenuItem value={item} key={item}>{item}</MenuItem>
                  ))}
              </ChplTextField>
            )}
        </DialogContent>
        <DialogActions>
          <Button
            id="invite-user-button"
            color="primary"
            variant="contained"
            onClick={formik.handleSubmit}
          >
            Send Invite
            <EmailIcon className={classes.iconSpacing} />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ChplUserInvite;

ChplUserInvite.propTypes = {
  roles: arrayOf(string).isRequired,
  dispatch: func.isRequired,
};
