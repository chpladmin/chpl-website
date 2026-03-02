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
import { node, func, bool } from 'prop-types';

import ChplCmsDisplay from 'components/cms-widget/cms-display';
import ChplCompareDisplay from 'components/compare-widget/compare-display';
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
    backgroundColor: palette.navBackground,
    color: '#fff',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 4px 0px 14px',
  },
  drawerItem: {
    color: '#fff',
  },
  drawerNestedItem: {
    color: '#fff',
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

  const handleHomeClick = () => {
    onHomeClick();
    setMobileMenuOpen(false);
  };

  const handleSearchClick = () => {
    onSearchClick();
    setMobileMenuOpen(false);
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
        onClose={() => setMobileMenuOpen(false)}
        classes={{ paper: classes.drawerPaper }}
      >
        <div className={classes.drawerHeader}>
        <Typography variant='h6'>CHPL Navigation</Typography>
          <IconButton onClick={() => setMobileMenuOpen(false)} color='primary' aria-label="close menu">
            <CloseIcon color='primary' />
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
              <ListItem button component="a" href="#/resources/overview" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Overview" />
              </ListItem>
              <ListItem button component="a" href={domainIsOn ? 'https://www.astp.hhs.gov/sites/default/files/policy/chpl_public_user_guide.pdf' : 'https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf'} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="CHPL Public User Guide" />
              </ListItem>
              {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer']) && (
                <ListItem button component="a" href={domainIsOn ? 'https://www.astp.hhs.gov/sites/default/files/policy/chpl_developer_user_guide.pdf' : 'https://www.healthit.gov/sites/default/files/policy/chpl_developer_user_guide.pdf'} target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                  <ListItemText primary="CHPL Developer User Guide" />
                </ListItem>
              )}
              <ListItem button component="a" href="#/resources/cms-lookup" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="CMS ID Reverse Lookup" />
              </ListItem>
              <ListItem button component="a" href="#/resources/download" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Download the CHPL" />
              </ListItem>
              <ListItem button component="a" href="#/resources/api" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="CHPL API" />
              </ListItem>
              <ListItem button component="a" href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Contact Us" />
              </ListItem>
            </List>
          </Collapse>
          <Divider className={classes.drawerDivider} />
          <ListItem button onClick={() => setMobileShortcutsOpen(!mobileShortcutsOpen)} className={classes.drawerItem}>
            <ListItemText primary="Shortcuts" />
            {mobileShortcutsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>
          <Collapse in={mobileShortcutsOpen}>
            <List disablePadding>
              <ListItem button component="a" href="#/api-documentation" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="API Information" />
              </ListItem>
              <ListItem button component="a" href="#/banned-developers" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Banned Developers" />
              </ListItem>
              <ListItem button component="a" href="#/charts" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Charts" />
              </ListItem>
              <ListItem button component="a" href="#/decertified-products" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Decertified Products" />
              </ListItem>
              <ListItem button component="a" href="#/decision-support-interventions" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Decision Support Interventions" />
              </ListItem>
              <ListItem button component="a" href="#/inactive-certificates" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Inactive Certificates" />
              </ListItem>
              <ListItem button component="a" href="#/corrective-action" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Products: Corrective Action" />
              </ListItem>
              <ListItem button component="a" href="#/real-world-testing" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="Real World Testing" />
              </ListItem>
              <ListItem button component="a" href="#/sed" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="SED Information" />
              </ListItem>
              <ListItem button component="a" href="#/svap" onClick={() => setMobileMenuOpen(false)} className={classes.drawerNestedItem}>
                <ListItemText primary="SVAP Information" />
              </ListItem>
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
