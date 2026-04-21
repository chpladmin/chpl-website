import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  Menu,
  makeStyles,
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { func } from 'prop-types';

import {
  developerGuideRoles,
  getResourceItems,
  shortcutItems,
} from './navigation-menu-items';

import ChplCmsDisplay from 'components/cms-widget/cms-display';
import ChplCompareDisplay from 'components/compare-widget/compare-display';
import { ChplLink } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  navContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'nowrap',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  whiteButton: {
    color: '#fff!important',
    textTransform: 'capitalize!important',
    '&:hover': {
      backgroundColor: `${palette.primaryDark}!important`,
      color: '#fff!important',
    },
    '&[aria-expanded="true"]': {
      backgroundColor: `${palette.white}!important`,
      color: `${palette.greyDark}!important`,
      fontWeight: 'bold',
    },
  },
  menuPaper: {
    marginTop: '8px',
  },
  dropdownWrapper: {
    position: 'relative',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    left: 0,
    backgroundColor: palette.white,
    borderRadius: '4px',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    zIndex: 1300,
    minWidth: '160px',
    padding: '8px 0',
  },
  dropdownRight: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    backgroundColor: palette.white,
    borderRadius: '4px',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)',
    zIndex: 1300,
    minWidth: '160px',
    padding: '8px 0',
  },
  dropdownItem: {
    padding: '6px 16px',
    whiteSpace: 'nowrap',
    '& span': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    '& a': {
      color: `${palette.primary} !important`,
    },
  },
});

function ChplDesktopNav({
  onHomeClick,
  onSearchClick,
}) {
  const $rootScope = getAngularService('$rootScope');
  const analytics = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const cmsButtonRef = useRef(null);
  const compareButtonRef = useRef(null);
  const resourcesButtonRef = useRef(null);
  const shortcutsButtonRef = useRef(null);
  const [cmsAnchorEl, setCmsAnchorEl] = useState(null);
  const [compareAnchorEl, setCompareAnchorEl] = useState(null);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const resourceItems = getResourceItems({
    includeDeveloperGuide: hasAnyRole(developerGuideRoles),
  });

  const classes = useStyles();

  useEffect(() => {
    const deregisterShowCmsWidget = $rootScope.$on('ShowCmsWidget', () => {
      setCompareAnchorEl(null);
      setResourcesOpen(false);
      setShortcutsOpen(false);
      setCmsAnchorEl(cmsButtonRef.current);
    });
    const deregisterHideCmsWidget = $rootScope.$on('HideCmsWidget', () => {
      setCmsAnchorEl(null);
    });
    const deregisterShowCompareWidget = $rootScope.$on('ShowCompareWidget', () => {
      setCmsAnchorEl(null);
      setResourcesOpen(false);
      setShortcutsOpen(false);
      setCompareAnchorEl(compareButtonRef.current);
    });
    const deregisterHideCompareWidget = $rootScope.$on('HideCompareWidget', () => {
      setCompareAnchorEl(null);
    });
    return () => {
      deregisterShowCmsWidget();
      deregisterHideCmsWidget();
      deregisterShowCompareWidget();
      deregisterHideCompareWidget();
    };
  }, [$rootScope]);

  const toggleCmsWidget = () => {
    setCmsAnchorEl(cmsAnchorEl ? null : cmsButtonRef.current);
  };

  const toggleCompareWidget = () => {
    setCompareAnchorEl(compareAnchorEl ? null : compareButtonRef.current);
  };


  const toggleResources = () => {
    setResourcesOpen((prev) => !prev);
  };

  const closeResources = () => {
    setResourcesOpen(false);
  };

  const toggleShortcuts = () => {
    setShortcutsOpen((prev) => !prev);
  };

  const closeShortcuts = () => {
    setShortcutsOpen(false);
  };

  const getItemAnalytics = (item) => ({
    ...analytics,
    event: item.analyticsEvent,
    category: item.analyticsCategory ?? 'Navigation',
  });

  const getDownloadIcon = (item) => {
    if (!item.showDownloadIcon) {
      return undefined;
    }
    if (item.primaryIcon) {
      return <CloudDownloadIcon color="primary" />;
    }
    return <CloudDownloadIcon />;
  };

  return (
    <Box className={classes.navContainer}>
      <Button
        onClick={onHomeClick}
        className={classes.whiteButton}
      >
        Home
      </Button>
      <Button
        onClick={onSearchClick}
        className={classes.whiteButton}
      >
        Search CHPL
      </Button>
      <Button
        ref={cmsButtonRef}
        onClick={toggleCmsWidget}
        aria-expanded={!!cmsAnchorEl}
        className={classes.whiteButton}
      >
        CMS ID Creator
      </Button>
      <Menu
        anchorEl={cmsAnchorEl}
        open={!!cmsAnchorEl}
        onClose={toggleCmsWidget}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        PaperProps={{
          className: classes.menuPaper,
          style: {
            width: '400px',
          },
        }}
      >
        <ChplCmsDisplay />
      </Menu>
      <Button
        ref={compareButtonRef}
        onClick={toggleCompareWidget}
        aria-expanded={!!compareAnchorEl}
        className={classes.whiteButton}
        color="inherit"
      >
        Compare Products
      </Button>
      <Menu
        anchorEl={compareAnchorEl}
        open={!!compareAnchorEl}
        onClose={toggleCompareWidget}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        PaperProps={{
          className: classes.menuPaper,
          style: {
            width: '400px',
          },
        }}
      >
        <ChplCompareDisplay />
      </Menu>
      <ClickAwayListener onClickAway={closeResources}>
        <Box className={classes.dropdownWrapper}>
          <Button
            ref={resourcesButtonRef}
            onClick={toggleResources}
            aria-expanded={resourcesOpen}
            className={classes.whiteButton}
          >
            CHPL Resources
          </Button>
          { resourcesOpen && (
            <Box className={classes.dropdown} role="menu">
              { resourceItems.map((item) => (
                <Box
                  key={item.key}
                  className={classes.dropdownItem}
                  onClick={closeResources}
                  role="menuitem"
                >
                  <ChplLink
                    href={item.href}
                    text={item.text}
                    analytics={getItemAnalytics(item)}
                    external={false}
                    router={item.router}
                    icon={getDownloadIcon(item)}
                    indicateOnHover
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </ClickAwayListener>
      <ClickAwayListener onClickAway={closeShortcuts}>
        <Box className={classes.dropdownWrapper}>
          <Button
            ref={shortcutsButtonRef}
            onClick={toggleShortcuts}
            aria-expanded={shortcutsOpen}
            className={classes.whiteButton}
          >
            Shortcuts
          </Button>
          { shortcutsOpen && (
            <Box className={classes.dropdownRight} role="menu">
              { shortcutItems.map((item) => (
                <Box
                  key={item.key}
                  className={classes.dropdownItem}
                  onClick={closeShortcuts}
                  role="menuitem"
                >
                  <ChplLink
                    href={item.href}
                    text={item.text}
                    analytics={getItemAnalytics(item)}
                    external={false}
                    router={item.router}
                    indicateOnHover
                  />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </ClickAwayListener>
    </Box>
  );
}

export default ChplDesktopNav;

ChplDesktopNav.propTypes = {
  onHomeClick: func.isRequired,
  onSearchClick: func.isRequired,
};
