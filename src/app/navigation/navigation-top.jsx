import React, { useState } from 'react';
import {
  AppBar,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { theme } from 'themes';

import ChplAnnouncementsFab from 'components/announcements/announcements-fab';
import ChplCmsDisplay from 'components/cms-widget/cms-display';
import ChplCompareDisplay from 'components/compare-widget/compare-display';

const useStyles = makeStyles({
});

function ChplNavigationTop() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showCmsWidget, setShowCmsWidget] = useState(false);
  const [showCompareWidget, setShowCompareWidget] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const classes = useStyles();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const searchChpl = () => {
    //<li><a ui-sref="search">Search CHPL <i class="fa fa-search"></i></a></li>
  };

  const toggleCmsWidget = (event) => {
    setAnchorEl(showCmsWidget ? null : event.currentTarget);
    setShowCmsWidget((p) => !p);
  };

  const toggleCompareWidget = (event) => {
    setAnchorEl(showCompareWidget ? null : event.currentTarget);
    setShowCompareWidget((p) => !p);
  };

  const toggleResources = (event) => {
    setAnchorEl(showResources ? null : event.currentTarget);
    setShowResources((p) => !p);
  };

  const toggleShortcuts = (event) => {
    setAnchorEl(showShortcuts ? null : event.currentTarget);
    setShowShortcuts((p) => !p);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Button
            onClick={searchChpl}
            endIcon={<SearchIcon />}
          >
            Search CHPL
          </Button>
          <Button
            onClick={toggleCmsWidget}
          >
            CMS ID Creator
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl && showCmsWidget}
            onClose={toggleCmsWidget}
          >
            <ChplCmsDisplay />
          </Menu>
          <Button
            onClick={toggleCompareWidget}
          >
            Compare Products
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl && showCompareWidget}
            onClose={toggleCompareWidget}
          >
            <ChplCompareDisplay />
          </Menu>
          <Button
            onClick={toggleResources}
          >
            Resources
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl && showResources}
            onClose={toggleResources}
          >
            <MenuItem><li><a ui-sref="resources.overview" analytics-on="click" analytics-event="Go to Overview Page" analytics-properties="{ category: 'Navigation' }">Overview</a></li></MenuItem>
            <MenuItem><li feature-flag="domain"><a href="https://www.astp.hhs.gov/sites/default/files/policy/chpl_public_user_guide.pdf" analytics-on="click" analytics-event="CHPL Public User Guide" analytics-properties="{ category: 'Resources', label: '' }">CHPL Public User Guide <i class="fa fa-download text-right"></i></a></li></MenuItem>
            <MenuItem><li feature-flag="domain" feature-flag-hide><a href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf" analytics-on="click" analytics-event="CHPL Public User Guide" analytics-properties="{ category: 'Resources', label: '' }">CHPL Public User Guide <i class="fa fa-download text-right"></i></a></li></MenuItem>
            <MenuItem><li feature-flag="domain" ng-if="vm.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])"><a href="https://www.astp.hhs.gov/sites/default/files/policy/chpl_developer_user_guide.pdf" analytics-on="click" analytics-event="CHPL Developer User Guide" analytics-properties="{ category: 'Resources', label: '' }">CHPL Developer User Guide <i class="fa fa-download text-right"></i></a></li></MenuItem>
            <MenuItem><li feature-flag="domain" feature-flag-hide ng-if="vm.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])"><a href="https://www.healthit.gov/sites/default/files/policy/chpl_developer_user_guide.pdf" analytics-on="click" analytics-event="CHPL Developer User Guide" analytics-properties="{ category: 'Resources', label: '' }">CHPL Developer User Guide <i class="fa fa-download text-right"></i></a></li></MenuItem>
            <MenuItem><li><a ui-sref="resources.cms-lookup" analytics-on="click" analytics-event="Go to CMS ID Reverse Lookup Page" analytics-properties="{ category: 'Navigation' }">CMS ID Reverse Lookup</a></li></MenuItem>
            <MenuItem><li><a ui-sref="resources.download" analytics-on="click" analytics-event="Go to Download the CHPL Page" analytics-properties="{ category: 'Navigation' }">Download the CHPL</a></li></MenuItem>
            <MenuItem><li><a ui-sref="resources.api" analytics-on="click" analytics-event="Go to CHPL API Page" analytics-properties="{ category: 'Navigation' }">CHPL API</a></li></MenuItem>
            <MenuItem><li><a href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51" analytics-on="click" analytics-event="Go to Contact Us Page" analytics-properties="{ category: 'Navigation' }">Contact Us</a></li></MenuItem>
          </Menu>
          <Button
            onClick={toggleShortcuts}
          >
            Shortcuts
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl && showShortcuts}
            onClose={toggleShortcuts}
          >
            <MenuItem><li><a ui-sref="shortcut.api-documentation" analytics-on="click" analytics-event="Go to API Info Page" analytics-properties="{ category: 'Navigation' }">API Information</a></li></MenuItem>
            <MenuItem><li><a ui-sref="shortcut.banned-developers" analytics-on="click" analytics-event="Go to Banned Developers Page" analytics-properties="{ category: 'Navigation' }">Banned Developers</a></li></MenuItem>
            <MenuItem><li><a ui-sref="charts" analytics-on="click" analytics-event="Go to Charts Page" analytics-properties="{ category: 'Navigation' }">Charts</a></li></MenuItem>
            <MenuItem><li><a ui-sref="shortcut.decertified-products" analytics-on="click" analytics-event="Go to Decertified Products Page" analytics-properties="{ category: 'Navigation' }">Decertified Products</a></li></MenuItem>
            <MenuItem><li><a ui-sref="shortcut.decision-support-interventions" analytics-on="click" analytics-event="Go to Decision Support Interventions Page" analytics-properties="{ category: 'Navigation' }">Decision Support Interventions</a></li></MenuItem>
            <MenuItem><li><a ui-sref="shortcut.inactive-certificates" analytics-on="click" analytics-event="Go to Inactive Certificates Page" analytics-properties="{ category: 'Navigation' }">Inactive Certificates</a></li></MenuItem>
            <MenuItem><li><a ui-sref="shortcut.corrective-action" analytics-on="click" analytics-event="Go to Products: Corrective Action Page" analytics-properties="{ category: 'Navigation' }">Products: Corrective Action</a></li></MenuItem>
            <MenuItem><li><a ui-sref="shortcut.real-world-testing" analytics-on="click" analytics-event="Go to Real World Testing Page" analytics-properties="{ category: 'Navigation' }">Real World Testing</a></li></MenuItem>
            <MenuItem><li><a ui-sref="shortcut.sed" analytics-on="click" analytics-event="Go to SED Info Page" analytics-properties="{ category: 'Navigation' }">SED Information</a></li></MenuItem>
            <MenuItem><li><a ui-sref="shortcut.svap" analytics-on="click" analytics-event="Go to SVAP Info Page" analytics-properties="{ category: 'Navigation' }">SVAP Information</a></li></MenuItem>
          </Menu>
          <ChplAnnouncementsFab />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default ChplNavigationTop;

ChplNavigationTop.propTypes = {
};
