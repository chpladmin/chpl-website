import React, { useContext, useState } from 'react';
import {
  Button,
  Box,
  Collapse,
  List,
  ListItem,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import {
  bool,
  func,
  node,
  shape,
  string,
} from 'prop-types';

import { ChplLink } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { palette } from 'themes';

const useStyles = makeStyles({
  menuContainer: {
    padding: 0,
    minWidth: '280px',
    width: '280px',
    color: palette.greyDark,
    backgroundColor: palette.white,
  },
  sectionHeader: {
    padding: '12px 16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: palette.greyDark,
    '&:hover': {
      backgroundColor: palette.secondary,
    },
  },
  sectionHeaderText: {
    fontWeight: 500,
    fontSize: '16px',
    display: 'flex',
    flexGrow: 1,
  },
  sectionChevron: {
    marginLeft: 'auto',
  },
  menuItem: {
    padding: '8px 16px 8px 32px',
    cursor: 'pointer',
    color: palette.primary,
    fontSize: '14px',
    textDecoration: 'underline',
    '& a': {
      color: `${palette.primary}!important`,
      textDecoration: 'underline!important',
    },
    '& .MuiSvgIcon-root': {
      color: palette.primary,
    },
    '&:hover': {
      backgroundColor: palette.secondary,
    },
  },
  menuItemText: {
    fontSize: '14px',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    gap: '8px',
    borderTop: `1px solid ${palette.divider}`,
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

// Shared section wrapper keeps collapse behavior consistent across admin menus.
function AdminMenuSection({
  children,
  classes,
  disablePadding = true,
  isOpen,
  onToggle,
  section,
  title,
}) {
  return (
    <>
      <ListItem
        className={classes.sectionHeader}
        onClick={() => onToggle(section)}
        divider
      >
        <Typography className={classes.sectionHeaderText}>{title}</Typography>
        {isOpen
          ? <ExpandLessIcon className={classes.sectionChevron} />
          : <ExpandMoreIcon className={classes.sectionChevron} />}
      </ListItem>
      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding={disablePadding}>
          {children}
        </List>
      </Collapse>
    </>
  );
}

AdminMenuSection.propTypes = {
  children: node.isRequired,
  classes: shape({}).isRequired,
  disablePadding: bool,
  isOpen: bool.isRequired,
  onToggle: func.isRequired,
  section: string.isRequired,
  title: string.isRequired,
};

function ChplAdminMenu({ onClose = () => {}, onDispatch = () => {} }) {
  const authService = getAngularService('authService');
  const { hasAnyRole } = useContext(UserContext);
  const [openSection, setOpenSection] = useState(null);
  const classes = useStyles();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleLogout = () => {
    authService.logout();
    onDispatch({ action: 'logout' });
    onClose();
  };

  const handleChangePassword = () => {
    onDispatch({ action: 'changePassword' });
  };

  return (
    <Box className={classes.menuContainer}>
      <List component="nav">
        {/* Administration Section */}
        {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff']) && (
          <AdminMenuSection
            classes={classes}
            section="administration"
            title="Administration"
            isOpen={openSection === 'administration'}
            onToggle={toggleSection}
            disablePadding={false}
          >
            {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/administration/upload"
                  text="Upload"
                  external={false}
                  router={{ sref: 'administration.upload' }}
                />
              </ListItem>
            )}
            {hasAnyRole(['chpl-admin', 'chpl-onc-acb']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/administration/confirm/listings"
                  text="Confirm Listings"
                  external={false}
                  router={{ sref: 'administration.confirm.listings' }}
                />
              </ListItem>
            )}
            {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/administration/reports"
                  text="Reports"
                  external={false}
                  router={{ sref: 'administration.reports' }}
                />
              </ListItem>
            )}
            {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-cms-staff']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/administration/cms"
                  text="CMS"
                  external={false}
                  router={{ sref: 'administration.cms' }}
                />
              </ListItem>
            )}
            {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/administration/change-requests"
                  text="Change Requests"
                  external={false}
                  router={{ sref: 'administration.change-requests' }}
                />
              </ListItem>
            )}
            {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/administration/system-maintenance"
                  text="System Maintenance"
                  external={false}
                  router={{ sref: 'administration.system-maintenance' }}
                />
              </ListItem>
            )}
            {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/administration/url-checker"
                  text="URL Checker"
                  external={false}
                  router={{ sref: 'administration.url-checker' }}
                />
              </ListItem>
            )}
            {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/users"
                  text="User Management"
                  external={false}
                  router={{ sref: 'users' }}
                />
              </ListItem>
            )}
            {hasAnyRole(['chpl-admin']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="rest/ff4j-console/home"
                  text="FF4j"
                  external
                />
              </ListItem>
            )}
          </AdminMenuSection>
        )}
        {/* Organizations Section */}
        {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
          <AdminMenuSection
            classes={classes}
            section="organizations"
            title="Organizations"
            isOpen={openSection === 'organizations'}
            onToggle={toggleSection}
          >
            <ListItem className={classes.menuItem} onClick={onClose}>
              <ChplLink
                href="#/organizations/developers"
                text="Developers"
                external={false}
                router={{ sref: 'organizations.developers' }}
              />
            </ListItem>
            <ListItem className={classes.menuItem} onClick={onClose}>
              <ChplLink
                href="#/organizations/onc-acbs"
                text="ONC-ACBs"
                external={false}
                router={{ sref: 'organizations.onc-acbs' }}
              />
            </ListItem>
            {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/organizations/onc-atls"
                  text="ONC-ATLs"
                  external={false}
                  router={{ sref: 'organizations.onc-atls' }}
                />
              </ListItem>
            )}
          </AdminMenuSection>
        )}

        {/* Activity Section */}
        {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
          <AdminMenuSection
            classes={classes}
            section="activity"
            title="Activity"
            isOpen={openSection === 'activity'}
            onToggle={toggleSection}
          >
            <ListItem className={classes.menuItem} onClick={onClose}>
              <ChplLink
                href="#/reports/activity"
                text="Search"
                external={false}
                router={{ sref: 'reports.activity' }}
              />
            </ListItem>
            <ListItem className={classes.menuItem} onClick={onClose}>
              <ChplLink
                href="#/reports/questionable-activity"
                text="Questionable Activity"
                external={false}
                router={{ sref: 'reports.questionable-activity' }}
              />
            </ListItem>
          </AdminMenuSection>
        )}

        {/* Surveillance Section */}
        {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
          <AdminMenuSection
            classes={classes}
            section="surveillance"
            title="Surveillance"
            isOpen={openSection === 'surveillance'}
            onToggle={toggleSection}
          >
            {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
              <ListItem className={classes.menuItem} onClick={onClose}>
                <ChplLink
                  href="#/surveillance/activity-reporting"
                  text="Activity Reporting"
                  external={false}
                  router={{ sref: 'surveillance.activity-reporting' }}
                />
              </ListItem>
            )}
            <ListItem className={classes.menuItem} onClick={onClose}>
              <ChplLink
                href="#/surveillance/complaints"
                text="Complaints Reporting"
                external={false}
                router={{ sref: 'surveillance.complaints' }}
              />
            </ListItem>
            <ListItem className={classes.menuItem} onClick={onClose}>
              <ChplLink
                href="#/surveillance/reporting"
                text="Reporting"
                external={false}
                router={{ sref: 'surveillance.reporting' }}
              />
            </ListItem>
          </AdminMenuSection>
        )}
      </List>

      {/* Footer with Log Out and Change Password */}
      <Box className={classes.footer}>
        <Button
          onClick={handleLogout}
          variant="outlined"
          endIcon={<ExitToAppIcon />}
          fullWidth
          color="primary"
        >
          Log Out
        </Button>
        <Button
          variant="text"
          onClick={handleChangePassword}
          endIcon={<VpnKeyIcon />}
          fullWidth
          color="primary"
        >
          Change Password
        </Button>
      </Box>
    </Box>
  );
}

export default ChplAdminMenu;

ChplAdminMenu.propTypes = {
  onClose: func,
  onDispatch: func,
};
