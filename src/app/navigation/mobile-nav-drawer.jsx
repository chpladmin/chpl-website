import React, { useContext, useState } from 'react';
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuIcon from '@material-ui/icons/Menu';
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
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  mobileContainer: {
    display: 'none',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
    },
  },
  mobileMenuButton: {
    color: '#fff',
  },
  drawerPaper: {
    width: 280,
    backgroundColor: palette.white,
    color: palette.greyDark,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 4px 0px 14px',
  },
  drawerItem: {
    color: palette.greyDark,
  },
  drawerNestedItem: {
    color: palette.greyDark,
    paddingLeft: '32px',
  },
  drawerDivider: {
    backgroundColor: palette.divider,
  },
  widgetContainer: {
    backgroundColor: '#fff',
    padding: '8px',
    maxWidth: '280px',
    overflow: 'hidden',
    '& .MuiCardContent-root': {
      padding: '8px !important',
      width: '100% !important',
      maxWidth: '264px !important',
    },
    '& .MuiChip-root': {
      maxWidth: '100%',
    },
    '& .MuiTypography-root': {
      wordBreak: 'break-word',
    },
    '& .MuiBox-root': {
      maxWidth: '100%',
    },
    '& button': {
      fontSize: '0.75rem',
    },
  },
});

function ChplMobileNavDrawer({ onHomeClick, onSearchClick }) {
  const { hasAnyRole } = useContext(UserContext);
  const analytics = useAnalyticsContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    cms: false,
    compare: false,
    resources: false,
    shortcuts: false,
  });
  const resourceItems = getResourceItems({
    includeDeveloperGuide: hasAnyRole(developerGuideRoles),
  });
  const classes = useStyles();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    eventTrack({
      ...analytics,
      event: 'Go to Home Page',
      category: 'Navigation',
    });
    onHomeClick();
    closeMobileMenu();
  };

  const handleSearchClick = () => {
    eventTrack({
      ...analytics,
      event: 'Go to Search Page',
      category: 'Navigation',
    });
    onSearchClick();
    closeMobileMenu();
  };

  const toggleSection = (section, title) => {
    const isCurrentlyOpen = expandedSections[section];
    eventTrack({
      ...analytics,
      event: isCurrentlyOpen ? `Collapse ${title}` : `Expand ${title}`,
      category: 'Navigation',
    });
    setExpandedSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const getItemAnalytics = (item) => ({
    ...analytics,
    event: item.analyticsEvent,
    category: item.analyticsCategory ?? 'Navigation',
  });

  const widgetSections = [{
    key: 'cms',
    title: 'CMS ID Creator',
    content: <ChplCmsDisplay />,
  }, {
    key: 'compare',
    title: 'Compare Products',
    content: <ChplCompareDisplay />,
  }];

  const linkSections = [{
    key: 'resources',
    title: 'CHPL Resources',
    items: resourceItems,
  }, {
    key: 'shortcuts',
    title: 'Shortcuts',
    items: shortcutItems,
  }];

  return (
    <>
      <Box className={classes.mobileContainer}>
        <IconButton
          className={classes.mobileMenuButton}
          onClick={() => setMobileMenuOpen(true)}
          aria-label="open navigation menu"
        >
          <MenuIcon style={{ color: '#fff' }} />
        </IconButton>
      </Box>
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="h6">CHPL Navigation</Typography>
          <IconButton onClick={closeMobileMenu} color="primary" aria-label="close menu">
            <CloseIcon color="primary" />
          </IconButton>
        </div>
        <Divider className={classes.drawerDivider} />
        <List disablePadding>
          <ListItem button onClick={handleHomeClick} className={classes.drawerItem}>
            <ListItemText primary="Home" />
          </ListItem>
          <Divider className={classes.drawerDivider} />
          <ListItem button onClick={handleSearchClick} className={classes.drawerItem}>
            <ListItemText primary="Search CHPL" />
          </ListItem>
          <Divider className={classes.drawerDivider} />
          {widgetSections.map((section) => (
            <React.Fragment key={section.key}>
              <ListItem button onClick={() => toggleSection(section.key, section.title)} className={classes.drawerItem}>
                <ListItemText primary={section.title} />
                {expandedSections[section.key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandedSections[section.key]}>
                <Box className={classes.widgetContainer}>
                  {section.content}
                </Box>
              </Collapse>
              <Divider className={classes.drawerDivider} />
            </React.Fragment>
          ))}
          { linkSections.map((section) => (
            <React.Fragment key={section.key}>
              <ListItem button onClick={() => toggleSection(section.key, section.title)} className={classes.drawerItem}>
                <ListItemText primary={section.title} />
                {expandedSections[section.key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandedSections[section.key]}>
                <List disablePadding>
                  { section.items.map((item) => (
                    <ListItem key={item.key} className={classes.drawerNestedItem} onClick={closeMobileMenu}>
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
              </Collapse>
              <Divider className={classes.drawerDivider} />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </>
  );
}

export default ChplMobileNavDrawer;

ChplMobileNavDrawer.propTypes = {
  onHomeClick: func.isRequired,
  onSearchClick: func.isRequired,
};
