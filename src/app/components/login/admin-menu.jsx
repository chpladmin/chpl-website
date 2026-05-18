import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Box,
  List,
  makeStyles,
} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { func } from 'prop-types';

import ChplAdminMenuLinkItem from './navigation/admin-menu-link-item';
import ChplAdminMenuSection from './navigation/admin-menu-section';
import sectionConfigs from './navigation/admin-menu-data';

import { eventTrack } from 'services/analytics.service';
import { FlagContext, UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette } from 'themes';

const useStyles = makeStyles({
  menuContainer: {
    padding: 0,
    minWidth: '280px',
    width: '280px',
    color: palette.greyDark,
    backgroundColor: palette.white,
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px',
    gap: '8px',
    borderTop: `1px solid ${palette.divider}`,
  },
});

function ChplAdminMenu({ onClose = () => {} }) {
  const { analytics } = useAnalyticsContext();
  const { isOn } = useContext(FlagContext);
  const {
    hasAnyRole,
    logout,
    setLoginWidgetState,
    user,
  } = useContext(UserContext);
  const [activeConfigs, setActiveConfigs] = useState([]);
  const [openSection, setOpenSection] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    setActiveConfigs([
      ...sectionConfigs, {
        key: 'developers',
        title: 'Developers',
        roles: ['chpl-developer'],
        items: user?.organizations
          .sort((a, b) => (a.name < b.name ? -1 : 1))
          .map((d) => ({
            key: d.id,
            roles: ['chpl-developer'],
            href: `#/organizations/developers/${d.id}`,
            text: d.name,
            router: { sref: 'organizations.developers.developer', options: { id: d.id } },
          })),
      }]
      .filter((s) => !s.flag || isOn(s.flag))
      .sort((a, b) => (a.title < b.title ? -1 : 1)));
  }, []);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const canAccess = (roles) => !roles || hasAnyRole(roles);

  const changePassword = (e) => {
    e.stopPropagation();
    eventTrack({
      ...analytics,
      event: 'Change Password',
      category: 'Authentication',
    });
    setLoginWidgetState('CHANGEPASSWORD');
  };

  return (
    <Box className={classes.menuContainer}>
      <List component="nav">
        { activeConfigs
          .filter((sectionConfig) => canAccess(sectionConfig.roles))
          .map((sectionConfig) => (
            <ChplAdminMenuSection
              key={sectionConfig.key}
              section={sectionConfig.key}
              title={sectionConfig.title}
              isOpen={openSection === sectionConfig.key}
              onToggle={toggleSection}
              disablePadding={sectionConfig.disablePadding}
            >
              { sectionConfig.items
                .filter((item) => canAccess(item.roles))
                .map((item) => (
                  <ChplAdminMenuLinkItem
                    key={item.key}
                    href={item.href}
                    text={item.text}
                    external={item.external}
                    router={item.router}
                    onClose={onClose}
                  />
                ))}
            </ChplAdminMenuSection>
          ))}
      </List>
      <Box className={classes.footer}>
        <Button
          onClick={logout}
          variant="outlined"
          endIcon={<ExitToAppIcon />}
          fullWidth
          color="primary"
        >
          Log Out
        </Button>
        <Button
          variant="text"
          onClick={changePassword}
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
};
