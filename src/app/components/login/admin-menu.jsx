import React, { useContext, useState } from 'react';
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { func } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  menuContainer: {
    padding: 0,
    minWidth: '300px',
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
  const $state = getAngularService('$state');
  const authService = getAngularService('authService');
  const { hasAnyRole } = useContext(UserContext);
  const [administrationOpen, setAdministrationOpen] = useState(false);
  const [organizationsOpen, setOrganizationsOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [surveillanceOpen, setSurveillanceOpen] = useState(false);
  const classes = useStyles();

  const navigateTo = (state) => {
    $state.go(state);
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    authService.logout();
    if (onClose) {
      onClose();
    }
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
              onClick={() => setAdministrationOpen(!administrationOpen)}
              divider
            >
              <Typography className={classes.sectionHeaderText}>Administration</Typography>
              {administrationOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={administrationOpen} timeout="auto" unmountOnExit>
              <List component="div" >
                {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('administration.upload')}
                  >
                    <ListItemText
                      primary="Upload"
                      classes={{ primary: classes.menuItemText }}
                    />
                  </ListItem>
                )}
                {hasAnyRole(['chpl-admin', 'chpl-onc-acb']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('administration.confirm.listings')}
                  >
                    <ListItemText
                      primary="Confirm Listings"
                      classes={{ primary: classes.menuItemText }}
                    />
                  </ListItem>
                )}
                {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('administration.reports')}
                  >
                    <ListItemText
                      primary="Reports"
                      classes={{ primary: classes.menuItemText }}
                    />
                  </ListItem>
                )}
                {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-cms-staff']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('administration.cms')}
                  >
                    <ListItemText
                      primary="CMS"
                      classes={{ primary: classes.menuItemText }}
                    />
                  </ListItem>
                )}
                {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('administration.api-keys')}
                  >
                    <ListItemText
                      primary="API Keys"
                      classes={{ primary: classes.menuItemText }}
                    />
                  </ListItem>
                )}
                {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('administration.change-requests')}
                  >
                    <ListItemText
                      primary="Change Request"
                      classes={{ primary: classes.menuItemText }}
                    />
                  </ListItem>
                )}
                {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('administration.system-maintenance')}
                  >
                    <ListItemText
                      primary="System Maintenance"
                      classes={{ primary: classes.menuItemText }}
                    />
                  </ListItem>
                )}
                {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('administration.url-checker')}
                  >
                    <ListItemText
                      primary="Style Guide"
                      classes={{ primary: classes.menuItemText }}
                    />
                  </ListItem>
                )}
                {hasAnyRole(['chpl-admin']) && (
                  <ListItem className={classes.menuItem}>
                    <a
                      href="rest/ff4j-console/home"
                      className={classes.link}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <ListItemText
                        primary="FF4j"
                        classes={{ primary: classes.menuItemText }}
                      />
                    </a>
                  </ListItem>
                )}
              </List>
            </Collapse>
          </>
        )}

        {/* Users Section */}
        {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
          <ListItem
            className={classes.sectionHeader}
            onClick={() => navigateTo('users')}
            divider
          >
            <Typography className={classes.sectionHeaderText}>Users</Typography>
          </ListItem>
        )}

        {/* Organizations Section */}
        {hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && (
          <>
            <ListItem
              className={classes.sectionHeader}
              onClick={() => setOrganizationsOpen(!organizationsOpen)}
                divider
            >
              <Typography className={classes.sectionHeaderText}>Organizations</Typography>
              {organizationsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={organizationsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  className={classes.menuItem}
                  onClick={() => navigateTo('organizations.developers')}
                >
                  <ListItemText
                    primary="Developers"
                    classes={{ primary: classes.menuItemText }}
                  />
                </ListItem>
                <ListItem
                  className={classes.menuItem}
                  onClick={() => navigateTo('organizations.onc-acbs')}
                >
                  <ListItemText
                    primary="ONC-ACBs"
                    classes={{ primary: classes.menuItemText }}
                  />
                </ListItem>
                {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('organizations.onc-atls')}
                  >
                    <ListItemText
                      primary="ONC-ATLs"
                      classes={{ primary: classes.menuItemText }}
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
              onClick={() => setActivityOpen(!activityOpen)}
              divider
            >
              <Typography className={classes.sectionHeaderText}>Activity</Typography>
              {activityOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={activityOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  className={classes.menuItem}
                  onClick={() => navigateTo('reports.activity')}
                >
                  <ListItemText
                    primary="Search"
                    classes={{ primary: classes.menuItemText }}
                  />
                </ListItem>
                <ListItem
                  className={classes.menuItem}
                  onClick={() => navigateTo('reports.questionable-activity')}
                >
                  <ListItemText
                    primary="Questionable Activity"
                    classes={{ primary: classes.menuItemText }}
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
              onClick={() => setSurveillanceOpen(!surveillanceOpen)}
              divider
            >
              <Typography className={classes.sectionHeaderText}>Surveillance</Typography>
              {surveillanceOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItem>
            <Collapse in={surveillanceOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {hasAnyRole(['chpl-admin', 'chpl-onc']) && (
                  <ListItem
                    className={classes.menuItem}
                    onClick={() => navigateTo('surveillance.activity-reporting')}
                  >
                    <ListItemText
                      primary="Activity Reporting"
                      classes={{ primary: classes.menuItemText }}
                    />
                  </ListItem>
                )}
                <ListItem
                  className={classes.menuItem}
                  onClick={() => navigateTo('surveillance.complaints')}
                >
                  <ListItemText
                    primary="Complaints Reporting"
                    classes={{ primary: classes.menuItemText }}
                  />
                </ListItem>
                <ListItem
                  className={classes.menuItem}
                  onClick={() => navigateTo('surveillance.reporting')}
                >
                  <ListItemText
                    primary="Reporting"
                    classes={{ primary: classes.menuItemText }}
                  />
                </ListItem>
              </List>
            </Collapse>
          </>
        )}
      </List>

      {/* Footer with Log Out and Change Password */}
      <Box className={classes.footer}>
        <Typography
          className={classes.link}
          onClick={handleLogout}
        >
          Log Out
        </Typography>
        <Typography
          className={classes.link}
          onClick={handleChangePassword}
        >
          Change Password
        </Typography>
      </Box>
    </Box>
  );
}

export default ChplAdminMenu;

ChplAdminMenu.propTypes = {
  onClose: func,
  onDispatch: func,
};
