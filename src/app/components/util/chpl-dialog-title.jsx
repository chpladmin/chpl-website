import React from 'react';
import { IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import MuiDialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';

import theme from '../../themes/theme';

const useStyles = makeStyles(() => ({
  closeButton: {
    position: [['absolute'], '!important'],
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
           size="large">
           <CloseIcon />
         </IconButton>
       )}
    </MuiDialogTitle>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplDialogTitle;
