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
import ChplToggle from 'components/login/toggle';
import { ChplLink } from 'components/util';
import { useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
});

function ChplNavigationTop() {
  const analytics = {
    ...useAnalyticsContext().analytics,
    category: 'Navigation',
  };
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
            <MenuItem>
              <ChplLink
                href="#/api-documentation"
                text="API Information"
                analytics={{
                  ...analytics,
                  event: 'Go to API Info Page',
                }}
                external={false}
                router={{ sref: 'shortcut.api-documentation' }}
              />
            </MenuItem>
            <MenuItem>
              <ChplLink
                href="#/banned-developers"
                text="Banned Developers"
                analytics={{
                  ...analytics,
                  event: 'Go to Banned Developers Page',
                }}
                external={false}
                router={{ sref: 'shortcut.banned-developers' }}
              />
            </MenuItem>
            <MenuItem>
              <ChplLink
                href="#/charts"
                text="Charts"
                analytics={{
                  ...analytics,
                  event: 'Go to Charts Page',
                }}
                external={false}
                router={{ sref: 'charts' }}
              />
            </MenuItem>
            <MenuItem>
              <ChplLink
                href="#/decertified-products"
                text="Decertified Products"
                analytics={{
                  ...analytics,
                  event: 'Go to Decertified Products Page',
                }}
                external={false}
                router={{ sref: 'shortcut.decertified-products' }}
              />
            </MenuItem>
            <MenuItem>
              <ChplLink
                href="#/decision-support-interventions"
                text="Decision Support Interventions"
                analytics={{
                  ...analytics,
                  event: 'Go to Decision Support Interventions Page',
                }}
                external={false}
                router={{ sref: 'shortcut.decision-support-interventions' }}
              />
            </MenuItem>
            <MenuItem>
              <ChplLink
                href="#/inactive-certificates"
                text="Inactive Certificates"
                analytics={{
                  ...analytics,
                  event: 'Go to Inactive Certificates Page',
                }}
                external={false}
                router={{ sref: 'shortcut.inactive-certificates' }}
              />
            </MenuItem>
            <MenuItem>
              <ChplLink
                href="#/corrective-action"
                text="Products: Corrective Action"
                analytics={{
                  ...analytics,
                  event: 'Go to Products: Corrective Action Page',
                }}
                external={false}
                router={{ sref: 'shortcut.corrective-action' }}
              />
            </MenuItem>
            <MenuItem>
              <ChplLink
                href="#/real-world-testing"
                text="Real World Testing"
                analytics={{
                  ...analytics,
                  event: 'Go to Real World Testing Page',
                }}
                external={false}
                router={{ sref: 'shortcut.real-world-testing' }}
              />
            </MenuItem>
            <MenuItem>
              <ChplLink
                href="#/sed"
                text="SED Information"
                analytics={{
                  ...analytics,
                  event: 'Go to SED Info Page',
                }}
                external={false}
                router={{ sref: 'shortcut.sed' }}
              />
            </MenuItem>
            <MenuItem>
              <ChplLink
                href="#/svap"
                text="SVAP Information"
                analytics={{
                  ...analytics,
                  event: 'Go to SVAP Info Page',
                }}
                external={false}
                router={{ sref: 'shortcut.svap' }}
              />
            </MenuItem>
          </Menu>
          <ChplAnnouncementsFab />
          <ChplToggle />
        </Toolbar>
      </AppBar>
    </>
  );
}

export default ChplNavigationTop;

ChplNavigationTop.propTypes = {
};
