import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

import ChplAnnouncements from 'components/announcement/announcements';
import ChplAccessibilityStandards from 'components/standards/accessibility-standard/accessibility-standards';
import ChplSvaps from 'components/standards/svap/svaps';
import ChplUcdProcesses from 'components/standards/ucd-process/ucd-processes';
import { BreadcrumbContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuItems: {
    padding: '8px',
    justifyContent: 'space-between',
    '&.Mui-disabled': {
      color: '#000',
      backgroundColor: '#f9f9f9',
      fontWeight: 600,
    },
  },
});

function ChplSystemMaintenance() {
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [active, setActive] = useState('');
  const classes = useStyles();
  let navigate;

  useEffect(() => {
    append(
      <Button
        key="system-maintenance.disabled"
        depth={0}
        variant="text"
        disabled
      >
        System Maintenance
      </Button>,
    );
    append(
      <Button
        key="system-maintenance"
        depth={0}
        variant="text"
        onClick={() => navigate('')}
      >
        System Maintenance
      </Button>,
    );
    display('system-maintenance.disabled');
  }, []);

  navigate = (target) => {
    hide('accessibilityStandards.viewall.disabled');
    hide('accessibilityStandards.viewall');
    hide('accessibilityStandards.add.disabled');
    hide('accessibilityStandards.edit.disabled');
    hide('announcements.viewall.disabled');
    hide('announcements.viewall');
    hide('announcements.add.disabled');
    hide('announcements.edit.disabled');
    hide('svaps.viewall.disabled');
    hide('svaps.viewall');
    hide('svaps.add.disabled');
    hide('svaps.edit.disabled');
    hide('ucdProcesses.viewall.disabled');
    hide('ucdProcesses.viewall');
    hide('ucdProcesses.add.disabled');
    hide('ucdProcesses.edit.disabled');
    setActive(target);
    if (target) {
      display('system-maintenance');
      hide('system-maintenance.disabled');
    } else {
      display('system-maintenance.disabled');
      hide('system-maintenance');
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.navigation}>
        <Card>
          <Button
            onClick={() => navigate('announcements')}
            disabled={active === 'announcements'}
            id="system-maintenance-navigation-announcements"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            Announcements
          </Button>
          <Button
            onClick={() => navigate('accessibilityStandards')}
            disabled={active === 'accessibilityStandards'}
            id="system-maintenance-navigation-accessibility-standards"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            Accessibility Standards
          </Button>
          <Button
            onClick={() => navigate('svaps')}
            disabled={active === 'svaps'}
            id="system-maintenance-navigation-svaps"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            SVAP
          </Button>
          <Button
            onClick={() => navigate('ucdProcesses')}
            disabled={active === 'ucdProcesses'}
            id="system-maintenance-navigation-ucd-processes"
            fullWidth
            variant="text"
            color="primary"
            endIcon={<ArrowForwardIcon />}
            className={classes.menuItems}
          >
            UCD Processes
          </Button>
        </Card>
      </div>
      <div>
        { active === ''
          && (
            <Card>
              <CardContent>
                <Typography>
                  System Maintenance is a tool for ONC administrators to add and edit system values that are maintained by ONC.
                </Typography>
                <List>
                  <ListItem>Announcements - Create and edit announcements displayed on CHPL for public and/or logged-in users</ListItem>
                  <ListItem>Accessibility Standards - Add and update the Accessibility Standards available to be applied to listings</ListItem>
                  <ListItem>QMS Standards - [future] Add and update the QMS Standards available to be applied to listings</ListItem>
                  <ListItem>SVAP - Add and update SVAP values for use by ONC-ACBs on each listing</ListItem>
                  <ListItem>UCD Processes - Add and update the UCD process(es) available to be applied to certification criteria</ListItem>
                </List>
              </CardContent>
            </Card>
          )}
        { active === 'announcements'
          && (
            <ChplAnnouncements />
          )}
        { active === 'accessibilityStandards'
          && (
            <ChplAccessibilityStandards />
          )}
        { active === 'svaps'
          && (
            <ChplSvaps />
          )}
        { active === 'ucdProcesses'
          && (
            <ChplUcdProcesses />
          )}
      </div>
    </div>
  );
}

export default ChplSystemMaintenance;

ChplSystemMaintenance.propTypes = {
};
