import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  func,
  object,
} from 'prop-types';

import interpretLink from './attestation-util';

import { ChplTextField } from 'components/util';

const useStyles = makeStyles({
  nonCaps: {
    textTransform: 'none',
  },
  radioGroup: {
    textTransform: 'none',
  },
});

function ChplAttestationWizardSection2(props) {
  const [form, setForm] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setForm(props.form);
    /*
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((attestation) => ({
        attestation: {
          ...attestation,
          display: interpretLink(attestation.description),
          validResponses: attestation.validResponses.sort((a, b) => a.sortOrder - b.sortOrder),
        },
        response: { response: '' },
      })));
      */
  }, [props.form]); // eslint-disable-line react/destructuring-assignment

  const handleResponse = (attestation, value) => {
    const updated = { ...form };/* attestationResponses.map((att) => {
      const updatedAttestation = {
        ...att,
      };
      if (attestation.attestation.id === att.attestation.id) {
        updatedAttestation.response = att.attestation.validResponses.find((response) => response.response === value);
      }
      return updatedAttestation;
    }); */
    setForm(updated);
    props.dispatch(form);
  };

  return (
    <Container maxWidth="md">
      <Typography gutterBottom variant="h2">
        Section 2 &mdash; Attestations
      </Typography>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="body1">
            As a health IT developer of certified health IT that had an active certification under the ONC Health IT Certification Program at any time during the Attestation Period, please indicate your compliance, noncompliance, or the inapplicability of each Condition and Maintenance of Certification requirement for the portion of the Attestation Period you had an active certification.
          </Typography>
          <Typography variant="body1">
            Select only one response for each statement.
          </Typography>
          <Divider />
          { /* attestationResponses
           .map((attestation, idx) => (
             <div key={attestation.attestation.id}>
               <Typography variant="subtitle1">
                 { idx + 1 }
                 :
                 {' '}
                 { attestation.attestation.condition.name }
               </Typography>
               <FormControl key={attestation.attestation.id} component="fieldset">
                 <FormLabel className={classes.nonCaps}>{attestation.attestation.display}</FormLabel>
                 <RadioGroup
                   className={classes.radioGroup}
                   name={`response-${attestation.attestation.id}`}
                   value={attestation.response.response}
                   onChange={(event) => handleResponse(attestation, event.currentTarget.value)}
                 >
                   {attestation.attestation.validResponses
                    .map((response) => (
                      <FormControlLabel
                        key={response.id}
                        value={response.response}
                        control={<Radio />}
                        label={response.response}
                        className={classes.nonCaps}
                      />
                    ))}
                 </RadioGroup>
               </FormControl>
               { idx !== attestationResponses.length - 1
                 && (
                   <Divider />
                 )}
             </div>
           )) */}
        </CardContent>
      </Card>
    </Container>
  );
}

export default ChplAttestationWizardSection2;

ChplAttestationWizardSection2.propTypes = {
  form: object.isRequired, // eslint-disable-line react/forbid-prop-types
  dispatch: func.isRequired,
};
