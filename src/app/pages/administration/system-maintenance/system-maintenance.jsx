import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplAnnouncements from 'components/announcement/announcements';
import ChplSvaps from 'components/standards/svap/svaps';
import { BreadcrumbContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    [theme.breakpoints.up('lg')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
    },
  },
  navigation: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  breadcrumbs: {
    textTransform: 'none',
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
        className={classes.breadcrumbs}
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
        className={classes.breadcrumbs}
        onClick={() => navigate()}
      >
        System Maintenance
      </Button>,
    );
    display('system-maintenance.disabled');
  }, []);

  navigate = (target) => {
    hide('announcements.viewall.disabled');
    hide('announcements.viewall');
    hide('announcements.add.disabled');
    hide('announcements.edit.disabled');
    hide('svaps.viewall.disabled');
    hide('svaps.viewall');
    hide('svaps.add.disabled');
    hide('svaps.edit.disabled');
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
    <Container maxWidth="lg" className={classes.container}>
      <Typography
        className={classes.fullWidthGridRow}
        variant="h1"
      >
        System Maintenance
      </Typography>
      <div className={classes.navigation}>
        <Button
          onClick={() => navigate('announcements')}
          disabled={active === 'announcements'}
        >
          Announcements
        </Button>
        <Button
          onClick={() => navigate('svaps')}
          disabled={active === 'svaps'}
        >
          SVAP Maintenance
        </Button>
      </div>
      <div>
        { active === ''
          && (
            <Typography>
              Insert text here giving ONC some instructions / overview
            </Typography>
          )}
        { active === 'announcements'
          && (
            <ChplAnnouncements />
          )}
        { active === 'svaps'
          && (
            <ChplSvaps />
          )}
      </div>
    </Container>
  );
}

export default ChplSystemMaintenance;

ChplSystemMaintenance.propTypes = {
};
