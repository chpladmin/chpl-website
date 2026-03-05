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

const sectionConfigs = [
  {
    key: 'administration',
    title: 'Administration',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff'],
    disablePadding: false,
    items: [
      {
        key: 'upload',
        roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
        href: '#/administration/upload',
        text: 'Upload',
        router: { sref: 'administration.upload' },
      },
      {
        key: 'confirm-listings',
        roles: ['chpl-admin', 'chpl-onc-acb'],
        href: '#/administration/confirm/listings',
        text: 'Confirm Listings',
        router: { sref: 'administration.confirm.listings' },
      },
      {
        key: 'reports',
        roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
        href: '#/administration/reports',
        text: 'Reports',
        router: { sref: 'administration.reports' },
      },
      {
        key: 'cms',
        roles: ['chpl-admin', 'chpl-onc', 'chpl-cms-staff'],
        href: '#/administration/cms',
        text: 'CMS',
        router: { sref: 'administration.cms' },
      },
      {
        key: 'change-requests',
        roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
        href: '#/administration/change-requests',
        text: 'Change Requests',
        router: { sref: 'administration.change-requests' },
      },
      {
        key: 'system-maintenance',
        roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
        href: '#/administration/system-maintenance',
        text: 'System Maintenance',
        router: { sref: 'administration.system-maintenance' },
      },
      {
        key: 'url-checker',
        roles: ['chpl-admin', 'chpl-onc'],
        href: '#/administration/url-checker',
        text: 'URL Checker',
        router: { sref: 'administration.url-checker' },
      },
      {
        key: 'user-management',
        roles: ['chpl-admin', 'chpl-onc'],
        href: '#/users',
        text: 'User Management',
        router: { sref: 'users' },
      },
      {
        key: 'ff4j',
        roles: ['chpl-admin'],
        href: 'rest/ff4j-console/home',
        text: 'FF4j',
        external: true,
      },
    ],
  },
  {
    key: 'organizations',
    title: 'Organizations',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    items: [
      {
        key: 'developers',
        href: '#/organizations/developers',
        text: 'Developers',
        router: { sref: 'organizations.developers' },
      },
      {
        key: 'onc-acbs',
        href: '#/organizations/onc-acbs',
        text: 'ONC-ACBs',
        router: { sref: 'organizations.onc-acbs' },
      },
      {
        key: 'onc-atls',
        roles: ['chpl-admin', 'chpl-onc'],
        href: '#/organizations/onc-atls',
        text: 'ONC-ATLs',
        router: { sref: 'organizations.onc-atls' },
      },
    ],
  },
  {
    key: 'activity',
    title: 'Activity',
    roles: ['chpl-admin', 'chpl-onc'],
    items: [
      {
        key: 'activity-search',
        href: '#/reports/activity',
        text: 'Search',
        router: { sref: 'reports.activity' },
      },
      {
        key: 'questionable-activity',
        href: '#/reports/questionable-activity',
        text: 'Questionable Activity',
        router: { sref: 'reports.questionable-activity' },
      },
    ],
  },
  {
    key: 'surveillance',
    title: 'Surveillance',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    items: [
      {
        key: 'activity-reporting',
        roles: ['chpl-admin', 'chpl-onc'],
        href: '#/surveillance/activity-reporting',
        text: 'Activity Reporting',
        router: { sref: 'surveillance.activity-reporting' },
      },
      {
        key: 'complaints-reporting',
        href: '#/surveillance/complaints',
        text: 'Complaints Reporting',
        router: { sref: 'surveillance.complaints' },
      },
      {
        key: 'reporting',
        href: '#/surveillance/reporting',
        text: 'Reporting',
        router: { sref: 'surveillance.reporting' },
      },
    ],
  },
];

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
  footer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    gap: '8px',
    borderTop: `1px solid ${palette.divider}`,
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

function AdminMenuLinkItem({
  classes,
  external = false,
  href,
  onClose,
  router = undefined,
  text,
}) {
  return (
    <ListItem className={classes.menuItem} onClick={onClose}>
      <ChplLink
        href={href}
        text={text}
        external={external}
        router={router}
      />
    </ListItem>
  );
}

AdminMenuLinkItem.propTypes = {
  classes: shape({
    menuItem: string,
  }).isRequired,
  external: bool,
  href: string.isRequired,
  onClose: func.isRequired,
  router: shape({
    sref: string,
  }),
  text: string.isRequired,
};

function ChplAdminMenu({ onClose = () => {}, onDispatch = () => {} }) {
  const authService = getAngularService('authService');
  const { hasAnyRole } = useContext(UserContext);
  const [openSection, setOpenSection] = useState(null);
  const classes = useStyles();

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const canAccess = (roles) => !roles || hasAnyRole(roles);

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
        {sectionConfigs
          .filter((sectionConfig) => canAccess(sectionConfig.roles))
          .map((sectionConfig) => (
            <AdminMenuSection
              key={sectionConfig.key}
              classes={classes}
              section={sectionConfig.key}
              title={sectionConfig.title}
              isOpen={openSection === sectionConfig.key}
              onToggle={toggleSection}
              disablePadding={sectionConfig.disablePadding}
            >
              {sectionConfig.items
                .filter((item) => canAccess(item.roles))
                .map((item) => (
                  <AdminMenuLinkItem
                    key={item.key}
                    classes={classes}
                    href={item.href}
                    text={item.text}
                    external={item.external}
                    router={item.router}
                    onClose={onClose}
                  />
                ))}
            </AdminMenuSection>
          ))}
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
