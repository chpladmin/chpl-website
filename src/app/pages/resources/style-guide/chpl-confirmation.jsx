import React from 'react';
import {
Button,
Dialog,
DialogActions,
DialogContent,
DialogContentText,
DialogTitle,
} from '@material-ui/core';

export default function sgDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open alert dialog
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
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">
            Agree
          </Button>
          <Button onClick={handleClose} color="default" variant="contained" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}