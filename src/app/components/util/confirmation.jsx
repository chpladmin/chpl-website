import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { func, string } from 'prop-types';

import ChplDialogTitle from './chpl-dialog-title';

function ChplConfirmation({ dispatch, text }) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    dispatch('close');
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="confirmation-title"
      open={open}
      fullWidth
      maxWidth="lg"
    >
      <ChplDialogTitle
        id="confirmation-title"
        onClose={handleClose}
      >
        Confirmation
      </ChplDialogTitle>
      <DialogContent dividers>
        <Typography
          align="center"
        >
          <CheckCircleOutlineIcon
            style={{ fontSize: 64 }}
          />
        </Typography>
        <Typography
          variant="h1"
          align="center"
        >
          Thank you!
        </Typography>
        <Typography
          variant="body1"
          align="center"
        >
          { text }
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          id="close-confirmation"
          color="primary"
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChplConfirmation;

ChplConfirmation.propTypes = {
  dispatch: func.isRequired,
  text: string.isRequired,
};
