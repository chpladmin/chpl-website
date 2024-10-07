import React, { useState } from 'react';
import { arrayOf, func, string } from 'prop-types';
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
});

function ChplCognitoUserInvite({ dispatch, groupNames }) {
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
      groupName: formik.values.groupName,
    };
    props.dispatch('cognito-invite', invitation);
    handleClose();
  };

  formik = useFormik({
    initialValues: {
      email: '',
      groupName: groupNames.length > 1 ? '' : groupNames[0],
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
          { groupNames.length > 1
            && (
            <ChplTextField
              select
              id="group-name"
              name="groupName"
              label="Group Name"
              required
              value={formik.values.groupName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.groupName && !!formik.errors.groupName}
              helperText={formik.touched.groupName && formik.errors.groupName}
            >
              { groupNames.map((item) => (
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

export default ChplCognitoUserInvite;

ChplCognitoUserInvite.propTypes = {
  groupNames: arrayOf(string).isRequired,
  dispatch: func.isRequired,
};
