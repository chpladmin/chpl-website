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
  Popover,
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
  const { isOpen: cmsIsOpen, setIsOpen: setCmsIsOpen } = useContext(CmsContext);
  const { isOpen: compareIsOpen, setIsOpen: setCompareIsOpen } = useContext(CompareContext);
  const { hasAnyRole } = useContext(UserContext);
  const cmsButtonRef = useRef(null);
  const compareButtonRef = useRef(null);
  const resourcesButtonRef = useRef(null);
  const shortcutsButtonRef = useRef(null);
  const [cmsAnchorEl, setCmsAnchorEl] = useState(null);
  const [compareAnchorEl, setCompareAnchorEl] = useState(null);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { currentHash } = useHashContext();
  const resourceItems = getResourceItems({ includeDeveloperGuide: hasAnyRole(developerGuideRoles) });

  const classes = useStyles();

  const getVisibleAnchor = (ref) => {
    const el = ref.current;
    if (!el || !el.isConnected || el.offsetParent === null) {
      return null;
    }
    return el;
  };

  const getPopoverMaxHeight = (anchor) => {
    const anchorBottom = anchor?.getBoundingClientRect().bottom ?? 72;
    return `calc(100vh - ${Math.ceil(anchorBottom + 24)}px)`;
  };

  useEffect(() => {
    if (cmsIsOpen) {
      const anchor = getVisibleAnchor(cmsButtonRef);
      if (!anchor) {
        return;
      }
      setCmsAnchorEl(anchor);
      setCompareAnchorEl(null);
      setResourcesOpen(false);
      setShortcutsOpen(false);
    } else {
      setCmsAnchorEl(null);
    }
  }, [cmsIsOpen]);

  useEffect(() => {
    if (compareIsOpen) {
      const anchor = getVisibleAnchor(compareButtonRef);
      if (!anchor) {
        return;
      }
      setCmsAnchorEl(null);
      setCompareAnchorEl(anchor);
      setResourcesOpen(false);
      setShortcutsOpen(false);
    } else {
      setCompareAnchorEl(null);
    }
  }, [compareIsOpen]);

  const closeAllNavOverlays = () => {
    setCmsAnchorEl(null);
    setCmsIsOpen(false);
    setCompareAnchorEl(null);
    setCompareIsOpen(false);
    setResourcesOpen(false);
    setShortcutsOpen(false);
  };

  const toggleCmsWidget = () => {
    if (cmsAnchorEl) {
      setCmsAnchorEl(null);
      setCmsIsOpen(false);
      return;
    }
    const anchor = getVisibleAnchor(cmsButtonRef);
    if (!anchor) {
      return;
    }
    closeAllNavOverlays();
    setCmsAnchorEl(anchor);
    setCmsIsOpen(true);
  };

  const toggleCompareWidget = () => {
    if (compareAnchorEl) {
      setCompareAnchorEl(null);
      setCompareIsOpen(false);
      return;
    }

    const anchor = getVisibleAnchor(compareButtonRef);
    if (!anchor) {
      return;
    }
    closeAllNavOverlays();
    setCompareAnchorEl(anchor);
    setCompareIsOpen(true);
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
        ref={cmsButtonRef}
        onClick={toggleCmsWidget}
        aria-expanded={!!cmsAnchorEl}
        className={classes.whiteButton}
      >
        CMS ID Creator
      </Button>
      <Popover
        anchorEl={cmsAnchorEl}
        open={!!cmsAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        hideBackdrop
        style={{ pointerEvents: 'none' }}
        PaperProps={{
          className: classes.menuPaper,
          style: {
            width: '400px',
            maxHeight: getPopoverMaxHeight(cmsAnchorEl),
            pointerEvents: 'auto',
          },
        }}
      >
        <ChplCmsDisplay />
      </Popover>
      <Button
        ref={compareButtonRef}
        onClick={toggleCompareWidget}
        aria-expanded={!!compareAnchorEl}
        className={classes.whiteButton}
        color="inherit"
      >
        Compare Products
      </Button>
      <Popover
        anchorEl={compareAnchorEl}
        open={!!compareAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        hideBackdrop
        style={{ pointerEvents: 'none' }}
        PaperProps={{
          className: classes.menuPaper,
          style: {
            width: '400px',
            maxHeight: getPopoverMaxHeight(compareAnchorEl),
            pointerEvents: 'auto',
          },
        }}
      >
        <ChplCompareDisplay />
      </Popover>
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
