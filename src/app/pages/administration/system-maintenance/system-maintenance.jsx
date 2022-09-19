import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Container,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplAnnouncements from 'components/announcement/announcements';
import ChplSvaps from 'components/standards/svap/svaps';
import { BreadcrumbContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

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
  breadcrumbs: {
    textTransform: 'none',
  },
  menuItems: {
    justifyContent:'left',
    padding: '8px',
    justifyContent: 'space-between',
    "&:focus": {
      color: "#000",
      backgroundColor: "#f9f9f9",
      fontWeight: '600',
    }
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
      <Card>
        <Button
          onClick={() => navigate('announcements')}
          fullWidth
          variant='text'
          color='primary'
          endIcon={<ArrowForwardIcon/>}
          className={classes.menuItems}
        >
          Announcements
        </Button>
        <Button
          onClick={() => navigate('svaps')}
          focusRipple={active === 'svaps'}
          fullWidth
          variant='text'
          color='primary'
          endIcon={<ArrowForwardIcon/>}
          className={classes.menuItems}
        >
          SVAP Maintenance
        </Button>
        </Card>
      </div>
      <div>
        { active === ''
          && (
            <Card>
            <CardContent>  
              <Typography>
                Select a section on the left to view more details.
              </Typography>
            </CardContent>
          </Card>
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
