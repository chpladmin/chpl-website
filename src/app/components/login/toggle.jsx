import React, { useState } from 'react';
import {
  Box, Button, Divider, Drawer, IconButton, Popover, Typography,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { func } from 'prop-types';

import ChplLogin from './login';
import ChplAdminMenu from './admin-menu';

import { theme, palette } from 'themes';

const styles = {
  loginSpacing: {
    margin: '8px',
  },
  popoverSpacing: {
    marginLeft: '8px',
  },
  popoverPaper: {
    maxWidth: '300px !important',
    right: 'auto !important',
  },
  loginCard: {
    maxWidth: '300px !important',
    [theme.breakpoints.up('md')]: {
      width: '375px',
    },
  },
  whiteButton: {
    color: '#fff !important',
    textTransform: 'capitalize !important',
    '&:hover': {
      backgroundColor: `${palette.primaryDark} !important`,
      color: '#fff !important',
    },
    '&[aria-expanded="true"]': {
      backgroundColor: `${palette.white} !important`,
      color: `${palette.greyDark} !important`,
      fontWeight: 'bold',
    },
  },
  drawer: {
    // sit above the top nav (drawer + 1), environment banner (drawer + 2) and sticky page headers
    zIndex: theme.zIndex.modal + 1,
  },
  drawerPaper: {
    width: 280,
    maxWidth: '100vw',
    backgroundColor: palette.white,
    color: palette.greyDark,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 4px 0 14px',
  },
  drawerContent: {
    paddingBottom: '8px',
  },
  drawerDivider: {
    backgroundColor: palette.divider,
  },
  drawerLoginCard: {
    width: '100%',
    maxWidth: '280px',
    padding: '0 8px 8px',
  },
};

function ChplToggle({ dispatch = () => {} }) {
  const loginState = useSelector((state) => state.userInfo.loginState);
  const user = useSelector((state) => state.userInfo.user);
  const [anchor, setAnchor] = useState(null);
  const [loginPopoverOpen, setLoginPopoverOpen] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isToggleOpen = isMobile ? adminDrawerOpen : loginPopoverOpen;

  const getTitle = () => {
    if (user?.fullName) {
      return (user.fullName);
    }
    return ('Administrator login');
  };

  const handleClick = (e) => {
    if (isMobile) {
      setAdminDrawerOpen(true);
      return;
    }
    setAnchor(e.currentTarget);
    setLoginPopoverOpen(true);
  };

  const handleClose = () => {
    setLoginPopoverOpen(false);
    setAdminDrawerOpen(false);
    setAnchor(null);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'forceChangePassword':
        dispatch(action);
        break;
      default:
        handleClose();
    }
  };

  return (
    <>
      <Button
        id="login-toggle"
        aria-controls={!isMobile && loginPopoverOpen ? 'admin-login-form' : undefined}
        aria-haspopup="dialog"
        aria-expanded={isToggleOpen ? 'true' : undefined}
        onClick={handleClick}
        sx={styles.whiteButton}
      >
        { getTitle() }
      </Button>
      <Popover
        id="admin-login-form"
        open={loginPopoverOpen}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={styles.popoverSpacing}
        disableScrollLock
        PaperProps={{
          id: 'admin-login-paper',
          sx: styles.popoverPaper,
        }}
      >
        { loginState === 'LOGGEDIN' ? (
          <ChplAdminMenu onClose={handleClose} />
        ) : (
          <Box sx={styles.loginCard}>
            <ChplLogin
              dispatch={handleDispatch}
            />
          </Box>
        )}
      </Popover>
      <Drawer
        anchor="right"
        open={isMobile && adminDrawerOpen}
        onClose={handleClose}
        sx={styles.drawer}
        slotProps={{ paper: { sx: styles.drawerPaper } }}
      >
        <Box sx={styles.drawerContent}>
          <Box sx={styles.drawerHeader}>
            <Typography variant="h6">Administrator Navigation</Typography>
            <IconButton onClick={handleClose} aria-label="close admin menu" size="large">
              <CloseIcon color="primary" />
            </IconButton>
          </Box>
          <Divider sx={styles.drawerDivider} />
          { loginState === 'LOGGEDIN' ? (
            <ChplAdminMenu onClose={handleClose} />
          ) : (
            <Box sx={styles.drawerLoginCard}>
              <ChplLogin
                dispatch={handleDispatch}
              />
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default ChplToggle;

ChplToggle.propTypes = {
  dispatch: func,
};
