import React, { useState } from 'react';
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
import { func, bool } from 'prop-types';

import ChplCmsDisplay from 'components/cms-widget/cms-display';
import ChplCompareDisplay from 'components/compare-widget/compare-display';
import { ChplLink } from 'components/util';
import {
  developerGuideRoles,
  getResourceItems,
  shortcutItems,
} from 'navigation/navigation-menu-items';
import { palette } from 'themes';

const useStyles = makeStyles((theme) => ({
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
}));

function ChplMobileNavDrawer({
  onHomeClick,
  onSearchClick,
  hasAnyRole,
  domainIsOn,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    cms: false,
    compare: false,
    resources: false,
    shortcuts: false,
  });
  const classes = useStyles();
  const resourceItems = getResourceItems({
    domainIsOn,
    includeDeveloperGuide: hasAnyRole(developerGuideRoles),
  });

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleHomeClick = () => {
    onHomeClick();
    closeMobileMenu();
  };

  const handleSearchClick = () => {
    onSearchClick();
    closeMobileMenu();
  };

  const toggleSection = (section) => {
    setExpandedSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const widgetSections = [
    {
      key: 'cms',
      title: 'CMS ID Creator',
      content: <ChplCmsDisplay />,
    },
    {
      key: 'compare',
      title: 'Compare Products',
      content: <ChplCompareDisplay />,
    },
  ];

  const linkSections = [
    {
      key: 'resources',
      title: 'Resources',
      items: resourceItems,
    },
    {
      key: 'shortcuts',
      title: 'Shortcuts',
      items: shortcutItems,
    },
  ];

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
              <ListItem button onClick={() => toggleSection(section.key)} className={classes.drawerItem}>
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
          {linkSections.map((section) => (
            <React.Fragment key={section.key}>
              <ListItem button onClick={() => toggleSection(section.key)} className={classes.drawerItem}>
                <ListItemText primary={section.title} />
                {expandedSections[section.key] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={expandedSections[section.key]}>
                <List disablePadding>
                  {section.items.map((item) => (
                    <ListItem key={item.key} className={classes.drawerNestedItem} onClick={closeMobileMenu}>
                      <ChplLink
                        href={item.href}
                        text={item.text}
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
  hasAnyRole: func.isRequired,
  domainIsOn: bool.isRequired,
};
