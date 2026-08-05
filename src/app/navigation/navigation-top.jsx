import React, { useContext } from 'react';
import {
  AppBar,
  Box,
  ButtonBase,
  Toolbar,
  makeStyles,
} from '@material-ui/core';

import ChplLogo from '../../assets/images/Certified-HealthIT-Product-List-Upper-Left-Logo.svg';

import ChplDesktopNav from './desktop-nav';
import ChplEnvironmentBanner from './environment-banner';
import ChplMobileNavDrawer from './mobile-nav-drawer';

import ChplAnnouncementsFab from 'components/announcements/announcements-fab';
import ChplToggle from 'components/login/toggle';
import { getAngularService } from 'services/angular-react-helper';
import { eventTrack } from 'services/analytics.service';
import { FlagContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: `${palette.navBackground} !important`,
    padding: '0 !important',
  },
  appBarWithBanner: {
    top: '25px',
  },
  '@keyframes shimmer': {
    '0%': {
      transform: 'translateX(-100%)',
      opacity: 0,
    },
    '50%': {
      opacity: 1,
    },
    '100%': {
      transform: 'translateX(100%)',
      opacity: 0,
    },
  },
  logoContainer: {
    position: 'relative',
    overflow: 'hidden',
    display: 'inline-block',
    marginRight: '16px',
  },
  logoButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: 0,
    minWidth: 0,
    borderRadius: 0,
    '&.Mui-focusVisible': {
      outline: `2px solid ${palette.white}`,
      outlineOffset: '2px',
    },
  },
  logo: {
    height: '40px',
    display: 'block',
    [theme.breakpoints.down('sm')]: {
      height: '32px',
    },
    [theme.breakpoints.down('xs')]: {
      height: '20px',
    },
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(63deg, transparent 0%, rgba(255, 255, 255, 0.6) 20%, transparent 6%)',
    animation: '$shimmer 2s ease-in-out forwards',
    animationFillMode: 'forwards',
    opacity: 0,
    pointerEvents: 'none',
  },
  offset: theme.mixins.toolbar,
  offsetWithBanner: {
    ...theme.mixins.toolbar,
    marginTop: '25px',
  },
  rightSide: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexShrink: 0,
    gap: '4px',
  },
  mobileOnly: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
});

function ChplNavigationTop() {
  const $location = getAngularService('$location');
  const $state = getAngularService('$state');
  const { analytics } = useAnalyticsContext();
  const { isProduction } = useContext(FlagContext);
  const classes = useStyles();

  const home = () => {
    eventTrack({
      ...analytics,
      event: 'Go to Home Page',
      category: 'Navigation',
    });
    sessionStorage.removeItem('storageKey-listingsPage-hasSearched');
    if ($location.url() === '/search') {
      $state.reload();
    } else {
      $state.go('search');
    }
  };

  const searchChpl = () => {
    eventTrack({
      ...analytics,
      event: 'Go to Search Page',
      category: 'Navigation',
    });
    $state.go('search');
  };

  return (
    <>
      {!isProduction && (
        <ChplEnvironmentBanner />
      )}
      <AppBar position="fixed" className={!isProduction ? `${classes.appBar} ${classes.appBarWithBanner}` : classes.appBar}>
        <Toolbar style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px',
        }}
        >
          <ButtonBase
            onClick={home}
            className={classes.logoButton}
            aria-label="Go to CHPL home"
          >
            <div className={classes.logoContainer}>
              <img src={ChplLogo} alt="Certified Health IT Product List Logo" className={classes.logo} />
              <div className={classes.shimmer} />
            </div>
          </ButtonBase>
          <Box
            className={classes.rightSide}
            style={{
              display: 'flex', alignItems: 'center', flexWrap: 'nowrap', flexShrink: 0,
            }}
          >
            <ChplDesktopNav
              onHomeClick={home}
              onSearchClick={searchChpl}
            />
            <Box className={classes.mobileOnly}>
              <ChplMobileNavDrawer
                onHomeClick={home}
                onSearchClick={searchChpl}
              />
            </Box>
            <ChplToggle />
            <ChplAnnouncementsFab />
          </Box>
        </Toolbar>
      </AppBar>
      <div
        className={!isProduction ? classes.offsetWithBanner : classes.offset}
        style={!isProduction
          ? { minHeight: '64px', marginTop: '25px' }
          : { minHeight: '64px' }}
      />
    </>
  );
}

export default ChplNavigationTop;

ChplNavigationTop.propTypes = {
};
