import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { func, bool, shape } from 'prop-types';

import ChplCmsDisplay from 'components/cms-widget/cms-display';
import ChplCompareDisplay from 'components/compare-widget/compare-display';
import { ChplLink } from 'components/util';

const useStyles = makeStyles((theme) => ({
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
    textTransform: "capitalize!important",
    fontSize: '0.875rem'
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
}));

function ChplDesktopNav({
  onHomeClick,
  onSearchClick,
  hasAnyRole,
  domainIsOn,
  analytics,
}) {
  const cmsButtonRef = React.useRef(null);
  const compareButtonRef = React.useRef(null);
  const resourcesButtonRef = React.useRef(null);
  const shortcutsButtonRef = React.useRef(null);
  const [cmsAnchorEl, setCmsAnchorEl] = useState(null);
  const [compareAnchorEl, setCompareAnchorEl] = useState(null);
  const [resourcesAnchorEl, setResourcesAnchorEl] = useState(null);
  const [shortcutsAnchorEl, setShortcutsAnchorEl] = useState(null);
  const classes = useStyles();

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
        className={classes.whiteButton}
      >
        Resources
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
        <MenuItem divider onClick={closeResources}>
          <ChplLink
            href="#/resources/overview"
            text="Overview"
            analytics={{
              ...analytics,
              event: 'Go to Overview Page',
            }}
            external={false}
            router={{ sref: 'resources.overview' }}
          />
        </MenuItem>
        { domainIsOn
          ? (
            <MenuItem divider onClick={closeResources}>
              <ChplLink
                href="https://www.astp.hhs.gov/sites/default/files/policy/chpl_public_user_guide.pdf"
                text="CHPL Public User Guide"
                analytics={{
                  ...analytics,
                  event: 'CHPL Public User Guide',
                  category: 'Resources',
                }}
                external={false}
                router={{ sref: 'resources.overview' }}
                icon={<CloudDownloadIcon />}
              />
            </MenuItem>
          ) : (
            <MenuItem divider onClick={closeResources}>
              <ChplLink
                href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf"
                text="CHPL Public User Guide"
                analytics={{
                  ...analytics,
                  event: 'CHPL Public User Guide',
                  category: 'Resources',
                }}
                external={false}
                router={{ sref: 'resources.overview' }}
                icon={<CloudDownloadIcon color="primary" />}
              />
            </MenuItem>
          )}
        { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])
          && domainIsOn
          && (
            <MenuItem divider onClick={closeResources}> 
              <ChplLink
                href="https://www.astp.hhs.gov/sites/default/files/policy/chpl_developer_user_guide.pdf"
                text="CHPL Developer User Guide"
                analytics={{
                  ...analytics,
                  event: 'CHPL Developer User Guide',
                  category: 'Resources',
                }}
                external={false}
                router={{ sref: 'resources.overview' }}
                icon={<CloudDownloadIcon />}
              />
            </MenuItem>
          )}
        { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])
          && !domainIsOn
          && (
            <MenuItem divider onClick={closeResources}>
              <ChplLink
                href="https://www.healthit.gov/sites/default/files/policy/chpl_developer_user_guide.pdf"
                text="CHPL Developer User Guide"
                analytics={{
                  ...analytics,
                  event: 'CHPL Developer User Guide',
                  category: 'Resources',
                }}
                external={false}
                router={{ sref: 'resources.overview' }}
                icon={<CloudDownloadIcon />}
              />
            </MenuItem>
          )}
        <MenuItem divider onClick={closeResources}>
          <ChplLink
            href="#/resources/cms-lookup"
            text="CMS ID Reverse Lookup"
            analytics={{
              ...analytics,
              event: 'Go to CMS ID Reverse Lookup Page',
            }}
            external={false}
            router={{ sref: 'resources.cms-lookup' }}
          />
        </MenuItem>
        <MenuItem divider onClick={closeResources}>
          <ChplLink
            href="#/resources/download"
            text="Download the CHPL"
            analytics={{
              ...analytics,
              event: 'Go to Download the CHPL Page',
            }}
            external={false}
            router={{ sref: 'resources.download' }}
          />
        </MenuItem>
        <MenuItem divider onClick={closeResources}>
          <ChplLink
            href="#/resources/api"
            text="CHPL API"
            analytics={{
              ...analytics,
              event: 'Go to CHPL API Page',
            }}
            external={false}
            router={{ sref: 'resources.api' }}
          />
        </MenuItem>
        <MenuItem divider onClick={closeResources}>
          <ChplLink
            href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51"
            text="Contact Us"
            analytics={{
              ...analytics,
              event: 'Go to Contact Us Page',
            }}
            external={false}
          />
        </MenuItem>
      </Menu>
      <Button
        ref={shortcutsButtonRef}
        onClick={toggleShortcuts}
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
        <MenuItem divider onClick={closeShortcuts}>
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
        <MenuItem divider onClick={closeShortcuts}>
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
        <MenuItem divider onClick={closeShortcuts}>
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
        <MenuItem divider onClick={closeShortcuts}>
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
        <MenuItem divider onClick={closeShortcuts}>
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
        <MenuItem divider onClick={closeShortcuts}>
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
        <MenuItem divider onClick={closeShortcuts}>
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
        <MenuItem divider onClick={closeShortcuts}>
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
        <MenuItem divider onClick={closeShortcuts}>
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
        <MenuItem divider onClick={closeShortcuts}>
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
    </Box>
  );
}

export default ChplDesktopNav;

ChplDesktopNav.propTypes = {
  onHomeClick: func.isRequired,
  onSearchClick: func.isRequired,
  hasAnyRole: func.isRequired,
  domainIsOn: bool.isRequired,
  analytics: shape({}).isRequired,
};
