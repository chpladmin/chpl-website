import React from 'react';
import {
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { developer as developerPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplAttestationWizardSection4(props) {
  const { developer } = props;
  const classes = useStyles();

  return (
    <Container maxWidth="md">
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

export default ChplAttestationWizardSection4;

ChplAttestationWizardSection4.propTypes = {
  developer: developerPropType.isRequired,
};
