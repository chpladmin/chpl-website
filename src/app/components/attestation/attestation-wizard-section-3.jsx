import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import Moment from 'react-moment';
import {
  bool,
  func,
} from 'prop-types';

import { ChplTextField } from 'components/util';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  attestationContainer: {
    display: 'grid',
    rowGap: '16px',
    columnGap: '16px',
    justifyContent: 'stretch',
    gridTemplateColumns: 'repeat(6, 1fr)',
  },
  nameContainer: {
    gridColumn: '1 / 3',
  },
  nameOnlyContainer: {
    gridColumn: '1 / 4',
  },
  titleContainer: {
    gridColumn: '3 / 5',
  },
  developerContainer: {
    gridColumn: '5 / 7',
  },
  developerOnlyContainer: {
    gridColumn: '4 / 7',
  },
  signatureContainer: {
    gridColumn: '1 / 6',
  },
  dateContainer: {
    gridColumn: '6 / 7',
  },
});

function ChplAttestationWizardSection3(props) {
  const { developer } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signature, setSignature] = useState('');
  const { user } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    setIsSubmitting(props.isSubmitting);
  }, [props.isSubmitting]); // eslint-disable-line react/destructuring-assignment

  const isSubmitDisabled = () => (signature !== user.fullName) || isSubmitting;

  const handleSignature = (event) => {
    setSignature(event.target.value);
  };

  const handleSubmit = () => {
    props.dispatch(signature);
  };

  return (
    <Container maxWidth="md" className={classes.attestationContainer}>
      <Typography variant="h2" className={classes.fullWidthGridRow}>
        Section 3 &mdash; Electronic Signature
      </Typography>
      <Card className={classes.fullWidthGridRow}>
        <CardContent>
          <Typography gutterBottom variant="body1">
            As a health IT developer of certified health IT, or as an authorized representative that is capable of binding the health IT developer, I certify the Attestations to the Secretary of Health and Human Services provided here are true and correct to the best of my knowledge and belief.
          </Typography>
          <Typography gutterBottom variant="body1">
            I understand that under certain circumstances ONC may directly review the actions or practices of a health IT developer of certified health IT, or its certified health IT, to determine whether they conform to the requirements of the Certification Program. This may result in corrective action and enforcement procedures under the Certification Program as necessary.
          </Typography>
          <Typography variant="body1">
            I also understand that submitting a false attestation may subject my company and me to liability under Federal law.
          </Typography>
        </CardContent>
      </Card>
      <Typography className={classes.fullWidthGridRow}>
        Typing your name below signifies you are completing the Attestations using an electronic signature. To continue with the electronic signature process, please enter your name and click the “Sign Electronically” button to confirm and submit the Attestations to your ONC-Authorized Certification Body (ONC-ACB) for review.
      </Typography>
      <Card className={user.title ? classes.nameContainer : classes.nameOnlyContainer}>
        <CardContent>
          <div>
            <Typography gutterBottom variant="subtitle1">
              Name:
            </Typography>
            <Typography variant="body1">{user.fullName}</Typography>
          </div>
        </CardContent>
      </Card>
      { user.title && (
        <Card className={classes.titleContainer}>
          <CardContent>
            <div>
              <Typography gutterBottom variant="subtitle1">
                Title:
              </Typography>
              <Typography variant="body1">{user.title}</Typography>
            </div>
          </CardContent>
        </Card>
      )}
      <Card className={user.title ? classes.developerContainer : classes.developerOnlyContainer}>
        <CardContent>
          <div>
            <Typography gutterBottom variant="subtitle1">
              Health IT Developer:
            </Typography>
            <Typography variant="body1">{developer.name}</Typography>
          </div>
        </CardContent>
      </Card>
      <Card className={classes.signatureContainer}>
        <CardContent>
          <ChplTextField
            id="signature"
            name="signature"
            label="Electronic Signature"
            required
            value={signature}
            onChange={handleSignature}
            helperText="Enter your name as it appears above"
          />
        </CardContent>
      </Card>
      <Card className={classes.dateContainer}>
        <CardContent>
          <Typography gutterBottom variant="subtitle1">
            Date:
          </Typography>
          <Typography variant="body1">
            <Moment
              date={Date.now()}
              format="DD MMM yyyy"
            />
          </Typography>
        </CardContent>
      </Card>
      <div className={classes.fullWidthGridRow}>
        <Button
          fullWidth
          id="sign-electronically"
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitDisabled()}
        >
          Sign Electronically
          <BorderColorIcon
            className={classes.iconSpacing}
          />
        </Button>
      </div>
    </Container>
  );
}

export default ChplAttestationWizardSection3;

ChplAttestationWizardSection3.propTypes = {
  isSubmitting: bool,
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};

ChplAttestationWizardSection3.defaultProps = {
  isSubmitting: false,
};
