import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { DeveloperContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 400px)',
  },
});

function ChplSbulWizardSection4() {
  const { developer } = useContext(DeveloperContext);
  const classes = useStyles();

  return (
    <Container className={classes.fixFooterSpacing} maxWidth="md">
      <Typography gutterBottom variant="h2" className={classes.fullWidthGridRow}>
        Section 4 &mdash; Confirmation
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="body1">
            Thank you for your Attestations Condition and Maintenance of Certification submission for the ONC Health IT Certification Program. An email confirmation has been sent to the registered CHPL users associated with
            {' '}
            {developer.name}
            . Please direct any inquiries regarding your submission to your ONC-Authorized Certification Body (ONC-ACB).
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplSbulWizardSection4;

ChplSbulWizardSection4.propTypes = {
};
