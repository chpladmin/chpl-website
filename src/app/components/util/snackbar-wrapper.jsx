import React, { createRef } from 'react';
import { Button, Collapse } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import { node } from 'prop-types';
import { SnackbarProvider } from 'notistack';

const useStyles = makeStyles({
  success: {
    backgroundColor: '#356635',
  },
  error: {
    backgroundColor: '#c44f65',
  },
  warning: {
    backgroundColor: '#e6ea0b',
    color: '#000000',
  },
  info: {
    backgroundColor: '#0e547f',
  },
  containerRoot: {
    flexWrap: 'nowrap',
    padding: '8px',
    zIndex: 1400,
  },
  root: {
    marginBottom: '64px',
  },
  dismissButton: {
    marginRight: '8px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SnackbarWrapper(props) {
  const { children } = props;
  const notistackRef = createRef();
  const classes = useStyles();

  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <SnackbarProvider
      className={classes.containerRoot}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
        containerAnchorOriginBottomCenter: classes.root,
      }}
      TransitionComponent={Collapse}
      hideIconVariant
      autoHideDuration={null}
      ref={notistackRef}
      action={(key) => (
        <div style={{ pointerEvents: 'auto', zIndex: 1402 }}>
          <Button
            className={classes.dismissButton}
            variant="contained"
            onClick={onClickDismiss(key)}>
            Dismiss
            {' '}
            <CloseIcon className={classes.iconSpacing} />
          </Button>
        </div>
      )}
    >
      { children }
    </SnackbarProvider>
  );
}

export default SnackbarWrapper;

SnackbarWrapper.propTypes = {
  children: node.isRequired,
};
