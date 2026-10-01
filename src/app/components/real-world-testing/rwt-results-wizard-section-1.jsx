import React from 'react';
import {
  Box, Card, CardContent, Container, Typography,
} from '@mui/material';

const styles = {
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
};

function ChplRwtResultsWizardSection1() {
  return (
    <Container sx={styles.fixFooterSpacing} maxWidth="md">
      <Box sx={styles.rwtResultsSectionContainer}>
        <Typography component="h2" variant="h3">
          Section 1 &mdash; Introduction
        </Typography>
      </Box>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="body1">
            Real World Testing Results 45 CFR 170.405(b)(2)(ii)
          </Typography>
          <ul>
            <li>A health IT developer must post an annual Real World Testing results report to its ONC-ACB by a date that enables the ONC-ACB to publish a publicly available hyperlink to the results report on CHPL no later than March 15 of each calendar year.</li>
            <li>The Real World Testing results report must address each of its Certified Health IT Module(s) that meet applicable certification criteria.</li>
          </ul>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplRwtResultsWizardSection1;

ChplRwtResultsWizardSection1.propTypes = {
};
