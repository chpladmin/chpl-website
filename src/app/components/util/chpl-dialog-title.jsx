import React from 'react';
import {
  IconButton,
  makeStyles,
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

import theme from '../../themes/theme';

const useStyles = makeStyles(() => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: '11px',
    color: theme.palette.grey[500],
  },
}));

function ChplDialogTitle(props) {
  const {
    children, onClose, ...other
  } = props;
  const classes = useStyles();
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <MuiDialogTitle {...other}>
      {children}
      {onClose
       && (
         <IconButton
           id="close-dialog"
           aria-label="close"
           className={classes.closeButton}
           onClick={onClose}
         >
           <CloseIcon />
         </IconButton>
       )}
    </MuiDialogTitle>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplDialogTitle;
