import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  demographicsContainerList: {
    fontSize: '0.875em',
  },
  demographicsSectionContainer: {
    marginBottom: '16px',
  },
  fixFooterSpacing: {
    paddingTop: '16px',
    minHeight: 'calc(100vh - 500px)',
  },
  forAssistanceContainer: {
    marginTop: '16px',
  },
});

function ChplDemographicsWizardSection1() {
  const classes = useStyles();

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="md">
      <Box className={classes.demographicsSectionContainer}>
        <Typography component="h2" variant="h3">
          Section 1 &mdash; Introduction
        </Typography>
      </Box>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="body1">
            Use this portal to update any contact personnel name change, as well as website, address, phone number, or email updates.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplDemographicsWizardSection1;

ChplDemographicsWizardSection1.propTypes = {
};
