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
import { func } from 'prop-types';

import { ChplLink } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  menuContainer: {
    padding: 0,
    minWidth: '350px',
  },
  sectionHeader: {
    padding: '12px 16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  sectionHeaderText: {
    fontWeight: 600,
    fontSize: '16px',
  },
  menuItem: {
    padding: '8px 16px 8px 32px',
    cursor: 'pointer',
    color: '#0066cc',
    fontSize: '14px',
    textDecoration: 'underline!important',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  menuItemText: {
    fontSize: '14px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '16px',
    gap: '8px',
    borderTop: '1px solid #e0e0e0',
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
          <>
            <ListItem
              className={classes.sectionHeader}
              onClick={() => toggleSection('administration')}
              divider
            >
              <Typography className={classes.sectionHeaderText}>Administration</Typography>
              {openSection === 'administration' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={openSection === 'administration'} timeout="auto" unmountOnExit>
              <List component="div">
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
                      text="Change Request"
                      external={false}
                      router={{ sref: 'administration.change-requests' }}
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
                      text="Users"
                      external={false}
                      router={{ sref: 'users' }}
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
                {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
                  <ListItem className={classes.menuItem} onClick={onClose}>
                    <ChplLink
                      href="#/administration/url-checker"
                      text="Style Guide"
                      external={false}
                      router={{ sref: 'administration.url-checker' }}
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
              </List>
            </Collapse>
          </>
        )}

        {/* Users Section */}

        {/* Organizations Section */}
        {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
          <>
            <ListItem
              className={classes.sectionHeader}
              onClick={() => toggleSection('organizations')}
              divider
            >
              <Typography className={classes.sectionHeaderText}>Organizations</Typography>
              {openSection === 'organizations' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={openSection === 'organizations'} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
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
              </List>
            </Collapse>
          </>
        )}

        {/* Activity Section */}
        {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
          <>
            <ListItem
              className={classes.sectionHeader}
              onClick={() => toggleSection('activity')}
              divider
            >
              <Typography className={classes.sectionHeaderText}>Activity</Typography>
              {openSection === 'activity' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={openSection === 'activity'} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
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
              </List>
            </Collapse>
          </>
        )}

        {/* Surveillance Section */}
        {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
          <>
            <ListItem
              className={classes.sectionHeader}
              onClick={() => toggleSection('surveillance')}
              divider
            >
              <Typography className={classes.sectionHeaderText}>Surveillance</Typography>
              {openSection === 'surveillance' ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={openSection === 'surveillance'} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
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
              </List>
            </Collapse>
          </>
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
