import React, { useContext, useEffect, useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplAnnouncementsFab from 'components/announcements/announcements-fab';
import ChplToggle from 'components/login/toggle';
import ChplDesktopNav from 'navigation/desktop-nav';
import ChplMobileNavDrawer from 'navigation/mobile-nav-drawer';
import { getAngularService } from 'services/angular-react-helper';
import { FlagContext, UserContext, useAnalyticsContext } from 'shared/contexts';
import { theme, palette } from 'themes';
import ChplLogo from '../../assets/images/CertifiedHealthIT_Logo.svg';

const useStyles = makeStyles({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: `${palette.navBackground} !important`,
    padding: '0px!important',
  },
  envBanner: {
    backgroundColor: `${palette.error}!important`,
    width: '100%',
    color: '#ffffff!important',
    zIndex: theme.zIndex.drawer + 2,
    '& .MuiToolbar-root': {
      minHeight: '25px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
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
  logo: {
    height: '40px',
    display: 'block',
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
});

function ChplNavigationTop() {
  const analytics = {
    ...useAnalyticsContext().analytics,
    category: 'Navigation',
  };
  const $localStorage = getAngularService('$localStorage');
  const $location = getAngularService('$location');
  const $rootScope = getAngularService('$rootScope');
  const $state = getAngularService('$state');
  const networkService = getAngularService('networkService');
  const { domainIsOn } = useContext(FlagContext);
  const { hasAnyRole } = useContext(UserContext);
  const [isProduction, setIsProduction] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    networkService.getSystemStatus()
      .then((response) => {
        let headerValue = '';
        // Local environments send the header key in all lower case
        // but other environments send the header key capitalized
        if (response.headers('Environment')) {
          headerValue = response.headers('Environment');
        } else if (response.headers('environment')) {
          headerValue = response.headers('environment');
        }
        setIsProduction(headerValue.toUpperCase() === 'PRODUCTION');
      });
  }, []);

  const home = () => {
    $rootScope.$broadcast('ClearResults', {});
    $localStorage.clearResults = true;
    sessionStorage.removeItem('storageKey-listingsPage-hasSearched');
    if ($location.url() === '/search') {
      $state.reload();
    } else {
      $state.go('search');
    }
  };

  const searchChpl = () => {
      $state.go('search');
  };

  return (
    <>
      {!isProduction && (
        <AppBar position="fixed" className={classes.envBanner}>
          <Toolbar style={{ minHeight: '25px' }}>
            <Typography variant="body2" noWrap style={{ fontWeight: 'bold' }}>
              ⚠ This is a test environment used for development and quality assurance.
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <AppBar position="fixed" className={!isProduction ? `${classes.appBar} ${classes.appBarWithBanner}` : classes.appBar}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '64px' }}>
          <Box display="flex" alignItems="center" onClick={home} style={{ cursor: 'pointer' }}>
            <div className={classes.logoContainer}>
              <img src={ChplLogo} alt="Certified Health IT Product List Logo" className={classes.logo} />
              <div className={classes.shimmer} />
            </div>
          </Box>
          <Box className={classes.rightSide} style={{ display: 'flex', alignItems: 'center', flexWrap: 'nowrap', flexShrink: 0 }}>
          <ChplDesktopNav
            onHomeClick={home}
            onSearchClick={searchChpl}
            hasAnyRole={hasAnyRole}
            domainIsOn={domainIsOn}
            analytics={analytics}
          />

          <ChplToggle />
          <ChplAnnouncementsFab />
          <ChplMobileNavDrawer
            onHomeClick={home}
            onSearchClick={searchChpl}
            hasAnyRole={hasAnyRole}
            domainIsOn={domainIsOn}
          />
          </Box>
        </Toolbar>
      </AppBar>
      <div
        className={!isProduction ? classes.offsetWithBanner : classes.offset}
        style={!isProduction
          ? { minHeight: '64px', marginTop: '25px' }
          : { minHeight: '64px' }
        }
      />
    </>
  );
}

export default ChplNavigationTop;

ChplNavigationTop.propTypes = {
};
