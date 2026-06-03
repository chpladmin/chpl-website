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
  rwtResultsContainerList: {
    fontSize: '0.875em',
  },
  rwtResultsSectionContainer: {
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

function ChplRwtResultsWizardSection1() {
  const classes = useStyles();

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="md">
      <Box className={classes.rwtResultsSectionContainer}>
        <Typography component="h2" variant="h3">
          Section 1 &mdash; Introduction
        </Typography>
      </Box>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="body1">
            The API Maintenance of Certification requirement for the publication of Service Base URL Lists at 45 CFR 170.404(b)(2) states that a health IT developer must publish, at no charge, the Service Base URL Lists and related organization details that can be used by patients to access their electronic health information.
          </Typography>
          <Typography gutterBottom variant="body1">
            Ensuring these Service Base URL Lists are available for use by patients is important for ongoing compliance with this requirement.
          </Typography>
          <Typography variant="body1">
            Nulla at elit enim. Sed at sem volutpat, pellentesque massa eget, feugiat erat. Ut facilisis suscipit iaculis. Vestibulum a blandit neque, ut dapibus risus. In id consectetur lorem. Aenean ut lacus eu quam hendrerit iaculis eget a nisi. Sed fermentum ipsum dolor, vel scelerisque nulla varius quis.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplRwtResultsWizardSection1;

ChplRwtResultsWizardSection1.propTypes = {
};
