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
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const [mobileShortcutsOpen, setMobileShortcutsOpen] = useState(false);
  const [mobileCmsOpen, setMobileCmsOpen] = useState(false);
  const [mobileCompareOpen, setMobileCompareOpen] = useState(false);
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
          <ListItem button onClick={() => setMobileCmsOpen(!mobileCmsOpen)} className={classes.drawerItem}>
            <ListItemText primary="CMS ID Creator" />
            {mobileCmsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={mobileCmsOpen}>
            <Box className={classes.widgetContainer}>
              <ChplCmsDisplay />
            </Box>
          </Collapse>
          <Divider className={classes.drawerDivider} />
          <ListItem button onClick={() => setMobileCompareOpen(!mobileCompareOpen)} className={classes.drawerItem}>
            <ListItemText primary="Compare Products" />
            {mobileCompareOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={mobileCompareOpen}>
            <Box className={classes.widgetContainer}>
              <ChplCompareDisplay />
            </Box>
          </Collapse>
          <Divider className={classes.drawerDivider} />
          <ListItem button onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)} className={classes.drawerItem}>
            <ListItemText primary="Resources" />
            {mobileResourcesOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={mobileResourcesOpen}>
            <List disablePadding>
              {resourceItems.map((item) => (
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
          <ListItem button onClick={() => setMobileShortcutsOpen(!mobileShortcutsOpen)} className={classes.drawerItem}>
            <ListItemText primary="Shortcuts" />
            {mobileShortcutsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={mobileShortcutsOpen}>
            <List disablePadding>
              {shortcutItems.map((item) => (
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
