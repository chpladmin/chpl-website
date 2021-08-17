import React from 'react';
import {
Button,
Dialog,
DialogActions,
DialogContent,
DialogContentText,
DialogTitle,
Divider,
makeStyles,
Slide,
} from '@material-ui/core';

import DoneIcon from '@material-ui/icons/Done';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
  actionDialogContainer:{
    justifyContent:'flex-start',
  },
  sgConfirmationTitle:{
    fontWeight:800,
    fontSize:'1.5em',
  },
  sgConfirmationContent:{
    color:'#000000'
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
        TransitionComponent={Transition}
      >
        <DialogTitle id="alert-dialog-title" className={classes.sgConfirmationTitle}>Are you sure you want to continue?</DialogTitle>
        <Divider/>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className={classes.sgConfirmationContent}>
          Ut volutpat mi ligula, sit amet pulvinar felis tincidunt in. Nam libero dui, molestie in volutpat eu, faucibus et urna. Vestibulum vitae leo rhoncus, interdum leo non, euismod erat. Proin vitae ex risus. Integer ac dapibus est, ut ullamcorper mauris. Morbi tincidunt ac ante id vulputate. Sed ut facilisis dui. Nunc ac fermentum libero. Ut sed ligula sit amet eros accumsan placerat.
          </DialogContentText>
        </DialogContent>
        <Divider/>
        <DialogActions className={classes.actionDialogContainer}>
          <Button onClick={handleClose} color="primary" variant="contained">
            Yes <DoneIcon className={classes.iconSpacing} />
          </Button>
          <Button onClick={handleClose} color="default" variant="contained" autoFocus>
            Cancel <CloseIcon className={classes.iconSpacing} />
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}