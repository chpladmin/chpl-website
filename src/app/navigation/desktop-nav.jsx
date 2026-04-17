import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  Menu,
  MenuItem,
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
    fontSize: '1rem',
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
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-8px',
      left: '20px',
      width: 0,
      height: 0,
      borderLeft: '8px solid transparent',
      borderRight: '8px solid transparent',
      borderBottom: '8px solid white',
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
  const [resourcesAnchorEl, setResourcesAnchorEl] = useState(null);
  const [shortcutsAnchorEl, setShortcutsAnchorEl] = useState(null);
  const resourceItems = getResourceItems({
    includeDeveloperGuide: hasAnyRole(developerGuideRoles),
  });
  const classes = useStyles();

  useEffect(() => {
    const deregisterShowCmsWidget = $rootScope.$on('ShowCmsWidget', () => {
      setCmsAnchorEl(null);
      setCompareAnchorEl(null);
      setResourcesAnchorEl(null);
      setShortcutsAnchorEl(null);
      setCmsAnchorEl(cmsButtonRef.current);
    });
    const deregisterShowCompareWidget = $rootScope.$on('ShowCompareWidget', () => {
      setCmsAnchorEl(null);
      setCompareAnchorEl(null);
      setResourcesAnchorEl(null);
      setShortcutsAnchorEl(null);
      setCompareAnchorEl(compareButtonRef.current);
    });
    return () => {
      deregisterShowCmsWidget();
      deregisterShowCompareWidget();
    };
  }, [$rootScope]);

  const toggleCmsWidget = () => {
    setCmsAnchorEl(cmsAnchorEl ? null : cmsButtonRef.current);
  };

  const toggleCompareWidget = () => {
    setCompareAnchorEl(compareAnchorEl ? null : compareButtonRef.current);
  };

  const toggleResources = () => {
    setResourcesAnchorEl(resourcesAnchorEl ? null : resourcesButtonRef.current);
  };

  const closeResources = () => {
    setResourcesAnchorEl(null);
  };

  const toggleShortcuts = () => {
    setShortcutsAnchorEl(shortcutsAnchorEl ? null : shortcutsButtonRef.current);
  };

  const closeShortcuts = () => {
    setShortcutsAnchorEl(null);
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
      <Button
        ref={resourcesButtonRef}
        onClick={toggleResources}
        aria-expanded={!!resourcesAnchorEl}
        className={classes.whiteButton}
      >
        CHPL Resources
      </Button>
      <Menu
        anchorEl={resourcesAnchorEl}
        open={!!resourcesAnchorEl}
        onClose={closeResources}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        PaperProps={{
          className: classes.menuPaper,
        }}
      >
        <MenuItem>
          <List>
            { resourceItems.map((item) => (
              <ListItem key={item.key} divider onClick={closeResources}>
                <ChplLink
                  href={item.href}
                  text={item.text}
                  analytics={getItemAnalytics(item)}
                  external={false}
                  router={item.router}
                  icon={getDownloadIcon(item)}
                />
              </ListItem>
            ))}
          </List>
        </MenuItem>
      </Menu>
      <Button
        ref={shortcutsButtonRef}
        onClick={toggleShortcuts}
        aria-expanded={!!shortcutsAnchorEl}
        className={classes.whiteButton}
      >
        Shortcuts
      </Button>
      <Menu
        anchorEl={shortcutsAnchorEl}
        open={!!shortcutsAnchorEl}
        onClose={closeShortcuts}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        disableScrollLock
        PaperProps={{
          className: classes.menuPaper,
        }}
      >
        <MenuItem>
          <List>
            { shortcutItems.map((item) => (
              <ListItem key={item.key} divider onClick={closeShortcuts}>
                <ChplLink
                  href={item.href}
                  text={item.text}
                  analytics={getItemAnalytics(item)}
                  external={false}
                  router={item.router}
                />
              </ListItem>
            ))}
          </List>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default ChplDesktopNav;

ChplDesktopNav.propTypes = {
  onHomeClick: func.isRequired,
  onSearchClick: func.isRequired,
};
