import React, { createRef } from 'react';
import { Button, Collapse, GlobalStyles } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { node } from 'prop-types';
import { SnackbarProvider } from 'notistack';

import { palette, theme } from 'themes';

const snackbarClasses = {
  success: 'chpl-snackbar-success',
  error: 'chpl-snackbar-error',
  warning: 'chpl-snackbar-warning',
  info: 'chpl-snackbar-info',
  containerRoot: 'chpl-snackbar-container',
  root: 'chpl-snackbar-root',
};

// notistack styles each variant with two classes, so ours need !important to win.
// Buttons can come from the provider or from each enqueueSnackbar call, so they all
// pick up the severity from the variant class on the surrounding snackbar
const variantStyles = (backgroundColor, color, buttonColor, buttonBorderColor = buttonColor) => ({
  backgroundColor: `${backgroundColor} !important`,
  color: `${color} !important`,
  '& .MuiButton-root, & .MuiButton-root:hover': {
    backgroundColor: palette.white,
    border: `1px solid ${buttonBorderColor}`,
    color: buttonColor,
  },
});

const globalStyles = {
  [`.${snackbarClasses.success}`]: variantStyles(palette.success, palette.white, palette.success),
  [`.${snackbarClasses.error}`]: variantStyles(palette.error, palette.white, palette.error),
  [`.${snackbarClasses.warning}`]: variantStyles(palette.warning, palette.black, palette.black, palette.warningDark),
  [`.${snackbarClasses.info}`]: variantStyles(palette.info, palette.white, palette.info),
  [`.${snackbarClasses.containerRoot}`]: {
    flexWrap: 'nowrap',
    padding: '8px',
    zIndex: theme.zIndex.snackbar,
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
              variant="outlined"
              onClick={onClickDismiss(key)}
            >
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
