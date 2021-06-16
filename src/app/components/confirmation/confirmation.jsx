import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Paper,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func, string } from 'prop-types';

import theme from '../../themes/theme';
import { ChplDialogTitle } from '../util';

const useStyles = makeStyles(() => ({
  noWrap: {
    whiteSpace: 'nowrap',
  },
}));

function ChplConfirmation(props) {
  /* eslint-disable react/destructuring-assignment */
  const [text, setText] = useState('');
  const [open, setOpen] = React.useState(true);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

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
            <i className="fa fa-check-circle-o fa-5x"></i>
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
            onClick={handleClose}>
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
