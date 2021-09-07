import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Slide,
  makeStyles,
} from '@material-ui/core';
import {
  func, string,
} from 'prop-types';

import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const useStyles = makeStyles({
  dialogTitle: {
    fontWeight: 800,
    fontSize: '1.5em',
  },
  dialogContent: {
    color: '#000000',
  },
  dialogActions: {
    justifyContent: 'flex-start',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplActionBarConfirmation(props) {
  const classes = useStyles();

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
      <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
        Confirm
      </DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className={classes.dialogContent}>
          { props.pendingMessage }
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions className={classes.dialogActions}>
        <Button onClick={() => act('yes')} color="primary" variant="contained" autoFocus>
          Yes
          {' '}
          <CheckIcon className={classes.iconSpacing} />
        </Button>
        <Button onClick={() => act('no')} color="default" variant="contained">
          No
          {' '}
          <CloseIcon className={classes.iconSpacing} />
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
