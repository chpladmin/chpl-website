import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import EmailIcon from '@material-ui/icons/Email';
import { arrayOf, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../themes/theme';
import { ChplDialogTitle, ChplTooltip, ChplTextField } from '../util';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gap: '8px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
}));

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid Email'),
  role: yup.string()
    .required('A ROLE must be selected'),
});

function ChplUserInvite(props) {
  /* eslint-disable react/destructuring-assignment */
  const [roles] = useState(props.roles.sort((a, b) => (a < b ? -1 : 1)));
  /* eslint-enable react/destructuring-assignment */

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
      role: formik.values.role,
    };
    props.dispatch('invite', invitation);
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
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <ThemeProvider theme={theme}>
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
              { roles.map((item) => (
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
            disabled={!formik.isValid}
          >
            Send Invite
            <EmailIcon className={classes.iconSpacing} />
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default ChplUserInvite;

ChplUserInvite.propTypes = {
  roles: arrayOf(string).isRequired,
  dispatch: func.isRequired,
};
