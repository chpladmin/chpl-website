import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { func, string } from 'prop-types';

import theme from '../../themes/theme';
import ChplDialogTitle from './chpl-dialog-title';

function ChplConfirmation(props) {
  /* eslint-disable react/destructuring-assignment */
  const [text, setText] = useState('');
  const [open, setOpen] = React.useState(true);
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setText(props.text);
  }, [props.text]); // eslint-disable-line react/destructuring-assignment

  const handleClose = () => {
    setOpen(false);
    props.dispatch('close');
  };

  return (
    <ThemeProvider theme={theme}>
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
            <i className="fa fa-check-circle-o fa-5x" />
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
    </ThemeProvider>
  );
}

export default ChplConfirmation;

ChplConfirmation.propTypes = {
  text: string.isRequired,
  dispatch: func.isRequired,
};
