import React from 'react';
import {
Button,
Dialog,
DialogActions,
DialogContent,
DialogContentText,
DialogTitle,
makeStyles,
} from '@material-ui/core';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
  actionDialogContainer:{
      justifyContent:'flex-start',
  },
});

export default function SgConfirmation() {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Save <SaveIcon className={classes.iconSpacing} />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure you want to continue?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          Ut volutpat mi ligula, sit amet pulvinar felis tincidunt in. Nam libero dui, molestie in volutpat eu, faucibus et urna. Vestibulum vitae leo rhoncus, interdum leo non, euismod erat. Proin vitae ex risus. Integer ac dapibus est, ut ullamcorper mauris. Morbi tincidunt ac ante id vulputate. Sed ut facilisis dui. Nunc ac fermentum libero. Ut sed ligula sit amet eros accumsan placerat.
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.actionDialogContainer}>
          <Button onClick={handleClose} color="primary" variant="contained">
            Agree <ArrowForwardIcon className={classes.iconSpacing} />
          </Button>
          <Button onClick={handleClose} color="default" variant="contained" autoFocus>
            Cancel <CloseIcon className={classes.iconSpacing} />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}