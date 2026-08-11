import React, {
  useContext,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  ClickAwayListener,
  makeStyles,
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { func } from 'prop-types';

import {
  developerGuideRoles,
  getResourceItems,
  shortcutItems,
} from './navigation-menu-items';

import { ChplLink } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import {
  CmsContext,
  CompareContext,
  UserContext,
  useAnalyticsContext,
  useHashContext,
} from 'shared/contexts';
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
    overflowY: 'auto',
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
    cursor: 'pointer',
    padding: '6px 16px',
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: palette.secondary,
    },
    '& span': {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    },
    '& a': {
      color: palette.primary,
      textDecoration: 'none',
    },
  },
  dropdownItemActive: {
    '& a': {
      color: palette.black,
      fontWeight: 'bold',
      textDecoration: 'none',
    },
  },
});

function ChplDesktopNav({
  onHomeClick,
  onSearchClick,
}) {
  const analytics = useAnalyticsContext();
  const {
    highlightNav: cmsHighlightNav,
    isOpen: cmsIsOpen,
    setIsOpen: setCmsIsOpen,
    setIsOpenFromNav: setCmsIsOpenFromNav,
  } = useContext(CmsContext);
  const {
    highlightNav: compareHighlightNav,
    isOpen: compareIsOpen,
    setIsOpen: setCompareIsOpen,
    setIsOpenFromNav: setCompareIsOpenFromNav,
  } = useContext(CompareContext);
  const { hasAnyRole } = useContext(UserContext);
  const resourcesButtonRef = useRef(null);
  const shortcutsButtonRef = useRef(null);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { currentHash } = useHashContext();
  const resourceItems = getResourceItems({ includeDeveloperGuide: hasAnyRole(developerGuideRoles) });

  const classes = useStyles();

  const closeAllNavOverlays = () => {
    setCmsIsOpen(false);
    setCompareIsOpen(false);
    setResourcesOpen(false);
    setShortcutsOpen(false);
  };

  const toggleCmsWidget = () => {
    closeAllNavOverlays();
    setCmsIsOpenFromNav(!cmsIsOpen);
  };

  const toggleCompareWidget = () => {
    closeAllNavOverlays();
    setCompareIsOpenFromNav(!compareIsOpen);
  };

  const toggleResources = () => {
    setResourcesOpen((prev) => {
      const next = !prev;
      if (next) {
        closeAllNavOverlays();
      }
      return next;
    });
  };

  const closeResources = () => {
    setResourcesOpen(false);
  };

  const toggleShortcuts = () => {
    setShortcutsOpen((prev) => {
      const next = !prev;
      if (next) {
        closeAllNavOverlays();
      }
      return next;
    });
  };

  const closeShortcuts = () => {
    setShortcutsOpen(false);
  };

  const getItemAnalytics = (item) => ({
    ...analytics,
    event: item.analyticsEvent,
    category: item.analyticsCategory ?? 'Navigation',
  });

  const handleMenuItemClick = (item, closeMenu) => (event) => {
    closeMenu();
    if (event.target.tagName === 'A') {
      return;
    }
    const itemAnalytics = getItemAnalytics(item);
    if (itemAnalytics.event) {
      eventTrack(itemAnalytics);
    }
    window.location.href = item.href;
  };

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
        onClick={() => {
          closeAllNavOverlays();
          onHomeClick();
        }}
        className={classes.whiteButton}
      >
        Home
      </Button>
      <Button
        onClick={() => {
          closeAllNavOverlays();
          onSearchClick();
        }}
        className={classes.whiteButton}
      >
        Search CHPL
      </Button>
      <Button
        onClick={toggleCmsWidget}
        aria-expanded={cmsHighlightNav}
        className={classes.whiteButton}
      >
        CMS ID Creator
      </Button>
      <Button
        onClick={toggleCompareWidget}
        aria-expanded={compareHighlightNav}
        className={classes.whiteButton}
        color="inherit"
      >
        Compare Products
      </Button>
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
                  className={`${classes.dropdownItem}${item.href && currentHash === item.href ? ` ${classes.dropdownItemActive}` : ''}`}
                  onClick={handleMenuItemClick(item, closeResources)}
                  role="menuitem"
                >
                  <ChplLink
                    href={item.href}
                    text={item.text}
                    analytics={getItemAnalytics(item)}
                    external={false}
                    router={item.router}
                    icon={getDownloadIcon(item)}
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
                  className={`${classes.dropdownItem}${item.href && currentHash === item.href ? ` ${classes.dropdownItemActive}` : ''}`}
                  onClick={handleMenuItemClick(item, closeShortcuts)}
                  role="menuitem"
                >
                  <ChplLink
                    href={item.href}
                    text={item.text}
                    analytics={getItemAnalytics(item)}
                    external={false}
                    router={item.router}
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
