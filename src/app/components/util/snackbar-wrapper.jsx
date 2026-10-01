import React, { createRef } from 'react';
import { Button, Collapse, GlobalStyles } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { node } from 'prop-types';
import { SnackbarProvider } from 'notistack';

const snackbarClasses = {
  success: 'chpl-snackbar-success',
  error: 'chpl-snackbar-error',
  warning: 'chpl-snackbar-warning',
  info: 'chpl-snackbar-info',
  containerRoot: 'chpl-snackbar-container',
  root: 'chpl-snackbar-root',
};

const globalStyles = {
  [`.${snackbarClasses.success}`]: {
    backgroundColor: '#356635',
  },
  [`.${snackbarClasses.error}`]: {
    backgroundColor: '#c44f65',
  },
  [`.${snackbarClasses.warning}`]: {
    backgroundColor: '#e6ea0b',
    color: '#000000',
  },
  [`.${snackbarClasses.info}`]: {
    backgroundColor: '#0e547f',
  },
  [`.${snackbarClasses.containerRoot}`]: {
    flexWrap: 'nowrap',
    padding: '8px',
    zIndex: 1400,
  },
  [`.${snackbarClasses.root}`]: {
    marginBottom: '64px',
  },
};

const styles = {
  dismissButton: {
    marginRight: '8px',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
};

function SnackbarWrapper(props) {
  const { children } = props;
  const notistackRef = createRef();

  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };

  return (
    <>
      <GlobalStyles styles={globalStyles} />
      <SnackbarProvider
        className={snackbarClasses.containerRoot}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        classes={{
          variantSuccess: snackbarClasses.success,
          variantError: snackbarClasses.error,
          variantWarning: snackbarClasses.warning,
          variantInfo: snackbarClasses.info,
          containerAnchorOriginBottomCenter: snackbarClasses.root,
        }}
        TransitionComponent={Collapse}
        hideIconVariant
        autoHideDuration={null}
        ref={notistackRef}
        action={(key) => (
          <div style={{ pointerEvents: 'auto', zIndex: 1402 }}>
            <Button
              sx={styles.dismissButton}
              variant="contained"
              onClick={onClickDismiss(key)}>
              Dismiss
              {' '}
              <CloseIcon sx={styles.iconSpacing} />
            </Button>
          </div>
        )}
      >
        { children }
      </SnackbarProvider>
    </>
  );
}

export default SnackbarWrapper;

SnackbarWrapper.propTypes = {
  children: node.isRequired,
};
