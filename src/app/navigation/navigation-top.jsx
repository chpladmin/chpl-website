import React, { useContext } from 'react';
import { keyframes } from '@emotion/react';
import {
  AppBar, Box, ButtonBase, Toolbar,
} from '@mui/material';

import ChplLogo from '../../assets/images/Certified-HealthIT-Product-List-Upper-Left-Logo.svg';

import ChplDesktopNav from './desktop-nav';
import ChplEnvironmentBanner from './environment-banner';
import ChplMobileNavDrawer from './mobile-nav-drawer';

import ChplAnnouncementsFab from 'components/announcements/announcements-fab';
import ChplToggle from 'components/login/toggle';
import { eventTrack } from 'services/analytics.service';
import { getCurrentUrl, goToState, reloadState } from 'services/navigation.service';
import {
  FlagContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { palette, theme } from 'themes';

const shimmer = keyframes({
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
});

const styles = {
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: `${palette.navBackground} !important`,
    padding: '0 !important',
  },
  appBarWithBanner: {
    top: '25px',
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
    [theme.breakpoints.down('md')]: {
      height: '32px',
    },
    [theme.breakpoints.down('sm')]: {
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
    animation: `${shimmer} 2s ease-in-out forwards`,
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
    [theme.breakpoints.down('md')]: {
      display: 'flex',
    },
  },
};

function ChplNavigationTop() {
  const { analytics } = useAnalyticsContext();
  const { isProduction } = useContext(FlagContext);

  const home = () => {
    eventTrack({
      ...analytics,
      event: 'Go to Home Page',
      category: 'Navigation',
    });
    sessionStorage.removeItem('storageKey-listingsPage-hasSearched');
    if (getCurrentUrl() === '/search') {
      reloadState();
    } else {
      goToState('search');
    }
  };

  const searchChpl = () => {
    eventTrack({
      ...analytics,
      event: 'Go to Search Page',
      category: 'Navigation',
    });
    goToState('search');
  };

  return (
    <>
      {!isProduction && (
        <ChplEnvironmentBanner />
      )}
      <AppBar position="fixed" sx={[styles.appBar, !isProduction && styles.appBarWithBanner]}>
        <Toolbar sx={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px',
        }}
        >
          <ButtonBase
            onClick={home}
            sx={styles.logoButton}
            aria-label="Go to CHPL home"
          >
            <Box sx={styles.logoContainer}>
              <Box component="img" src={ChplLogo} alt="Certified Health IT Product List Logo" sx={styles.logo} />
              <Box sx={styles.shimmer} />
            </Box>
          </ButtonBase>
          <Box
            sx={styles.rightSide}
          >
            <ChplDesktopNav
              onHomeClick={home}
              onSearchClick={searchChpl}
            />
            <Box sx={styles.mobileOnly}>
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
      <Box
        sx={[styles.offset, !isProduction && styles.offsetWithBanner, { minHeight: '64px' }]}
      />
    </>
  );
}

export default ChplNavigationTop;

ChplNavigationTop.propTypes = {
};
