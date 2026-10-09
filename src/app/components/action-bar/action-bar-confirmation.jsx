import React, { forwardRef } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Slide,
} from '@mui/material';
import {
  func, string,
} from 'prop-types';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

import { palette, utilStyles } from 'themes';

const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

function ChplActionBarConfirmation(props) {
  const act = (action) => {
    props.dispatch(action);
  };

  return (
    <Dialog
      open
      onClose={() => act('no')}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={Transition}
    >
      <DialogTitle id="alert-dialog-title" sx={{ fontWeight: 800, fontSize: '1.5em' }}>
        Confirm
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ color: palette.black }}>
          { props.pendingMessage }
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ justifyContent: 'flex-start' }}>
        <Button
          onClick={() => act('no')}
          color="secondary"
          variant="contained"
          id="action-confirmation-no"
        >
          No
          {' '}
          <CloseIcon sx={utilStyles.iconSpacing} />
        </Button>
        <Button
          onClick={() => act('yes')}
          color="primary"
          variant="contained"
          autoFocus
          id="action-confirmation-yes"
        >
          Yes
          {' '}
          <CheckIcon sx={utilStyles.iconSpacing} />
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ChplActionBarConfirmation;

ChplActionBarConfirmation.propTypes = {
  dispatch: func.isRequired,
  pendingMessage: string.isRequired,
};
