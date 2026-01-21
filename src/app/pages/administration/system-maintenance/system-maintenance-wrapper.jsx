import React from 'react';
import {
  Box,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplSystemMaintenance from './system-maintenance';

import AppWrapper from 'app-wrapper';

const useStyles = makeStyles({
  pageHeader: {
    backgroundColor: '#ffffff',
    padding: '32px',
    marginBottom: '16px',
  },
  pageTitle: {
    fontSize: '1.25em',
    fontWeight: 'bold',
    maxWidth: '100%',
  },
});

function ChplSystemMaintenanceWrapper() {
  const classes = useStyles();

  return (
    <AppWrapper>
      <Box className={classes.pageHeader}>
        <Container maxWidth="lg">
        <Typography variant="h1" className={classes.pageTitle}>
          System Maintenance
        </Typography>
        </Container>
      </Box>
      <Container maxWidth="lg">
        <ChplSystemMaintenance />
      </Container>
    </AppWrapper>
  );
}

export default ChplSystemMaintenanceWrapper;

ChplSystemMaintenanceWrapper.propTypes = {
};
