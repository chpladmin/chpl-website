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
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
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
import { UserContext, useAnalyticsContext, useHashContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const styles = {
  mobileContainer: {
    display: 'none',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
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
    '&:hover': {
      backgroundColor: palette.secondary,
    },
  },
  drawerNestedItem: {
    color: palette.greyDark,
    cursor: 'pointer',
    paddingLeft: '32px',
    '&:hover': {
      backgroundColor: palette.secondary,
    },
    '& a': {
      textDecoration: 'none',
    },
  },
  drawerNestedItemActive: {
    '& a': {
      color: palette.black,
      fontWeight: 'bold',
      textDecoration: 'none',
    },
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
};

function ChplMobileNavDrawer({ onHomeClick, onSearchClick }) {
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentHash } = useHashContext();
  const [expandedSections, setExpandedSections] = useState({
    cms: false,
    compare: false,
    resources: false,
    shortcuts: false,
  });
  const resourceItems = getResourceItems({
    includeDeveloperGuide: hasAnyRole(developerGuideRoles),
  });
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const collapseSection = (section) => {
    setExpandedSections((previous) => ({
      ...previous,
      [section]: false,
    }));
  };

  const getDownloadIcon = (item) => {
    if (!item.showDownloadIcon) {
      return undefined;
    }
    if (item.primaryIcon) {
      return <CloudDownloadIcon color="primary" />;
    }
    return <CloudDownloadIcon htmlColor={palette.greyDark} />;
  };

  const getItemAnalytics = (item) => ({
    ...analytics,
    event: item.analyticsEvent,
    category: item.analyticsCategory ?? 'Navigation',
  });

  const handleHomeClick = () => {
    onHomeClick();
    closeMobileMenu();
  };

  const handleSearchClick = () => {
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

  const widgetSections = [{
    key: 'cms',
    title: 'CMS ID Creator',
    content: <ChplCmsDisplay onClose={() => collapseSection('cms')} />,
  }, {
    key: 'compare',
    title: 'Compare Products',
    content: <ChplCompareDisplay onClose={() => collapseSection('compare')} />,
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
      <Box sx={styles.mobileContainer}>
        <IconButton
          sx={styles.mobileMenuButton}
          onClick={() => setMobileMenuOpen(true)}
          aria-label="open navigation menu"
          size="large"
        >
          <MenuIcon style={{ color: '#fff' }} />
        </IconButton>
      </Box>
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={closeMobileMenu}
        slotProps={{ paper: { sx: styles.drawerPaper } }}
      >
        <Box sx={styles.drawerHeader}>
          <Typography variant="h6">CHPL Navigation</Typography>
          <IconButton
            onClick={closeMobileMenu}
            color="primary"
            aria-label="close menu"
            size="large"
          >
            <CloseIcon color="primary" />
          </IconButton>
        </Box>
        <Divider sx={styles.drawerDivider} />
        <List disablePadding>
          <ListItem button onClick={handleHomeClick} sx={styles.drawerItem}>
            <ListItemText primary="Home" />
          </ListItem>
          <Divider sx={styles.drawerDivider} />
          <ListItem button onClick={handleSearchClick} sx={styles.drawerItem}>
            <ListItemText primary="Search CHPL" />
          </ListItem>
          <Divider sx={styles.drawerDivider} />
          {widgetSections.map((section) => (
            <React.Fragment key={section.key}>
              <ListItem button onClick={() => toggleSection(section.key, section.title)} sx={styles.drawerItem}>
                <ListItemText primary={section.title} />
                {expandedSections[section.key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandedSections[section.key]}>
                <Box sx={styles.widgetContainer}>
                  {section.content}
                </Box>
              </Collapse>
              <Divider sx={styles.drawerDivider} />
            </React.Fragment>
          ))}
          { linkSections.map((section) => (
            <React.Fragment key={section.key}>
              <ListItem button onClick={() => toggleSection(section.key, section.title)} sx={styles.drawerItem}>
                <ListItemText primary={section.title} />
                {expandedSections[section.key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandedSections[section.key]}>
                <List disablePadding>
                  { section.items.map((item) => (
                    <ListItem
                      key={item.key}
                      sx={[styles.drawerNestedItem, item.href && currentHash === item.href && styles.drawerNestedItemActive]}
                      onClick={closeMobileMenu}
                    >
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
              </Collapse>
              <Divider sx={styles.drawerDivider} />
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
