import React, { useState } from 'react';
import {
  func,
} from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmailIcon from '@material-ui/icons/Email';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplDialogTitle, ChplTooltip, ChplTextField } from '../util';

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
});

function ChplCognitoUserInvite(props) {
  const [open, setOpen] = React.useState(false);

  const classes = useStyles();
  let formik;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    formik.resetForm();
    setOpen(false);
  };

  const invite = () => {
    const invitation = {
      email: formik.values.email,
    };
    props.dispatch('cognito-invite', invitation);
    handleClose();
  };

  formik = useFormik({
    initialValues: {
      email: '',
    },
    onSubmit: () => {
      invite();
    },
    validationSchema,
  });

  return (
    <>
      <ChplTooltip title="Invite a Cognito User">
        <Button
            id="invite-user-button"
            aria-label="Open Cognito User Invitation dialog"
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

export default ChplCognitoUserInvite;

ChplCognitoUserInvite.propTypes = {
  dispatch: func.isRequired,
};
