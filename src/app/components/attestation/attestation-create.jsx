import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  Radio,
  RadioGroup,
  ThemeProvider,
  Typography,
  makeStyles,
  Checkbox,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Moment from 'react-moment';

import ChplAttestationProgress from './attestation-progress';
import interpretLink from './attestation-util';

import { useFetchAttestationData } from 'api/attestations';
import { useFetchChangeRequestTypes, usePostChangeRequest } from 'api/change-requests';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
  listingInspectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 64px',
  },
  nonCaps: {
    textTransform: 'none',
  },
  radioGroup: {
    flexDirection: 'row',
    textTransform: 'none',
  },
  electronicSignatureCheckboxItem: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  userContext: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap:'32px',
    justifyContent:'stretch',
  },
  signDateContainer: {
    display: 'grid',
    gridTemplateColumns: '10fr 2fr',
    gap:'32px',
    justifyContent:'stretch',
  },
});

function ChplAttestationCreate(props) {
  const $state = getAngularService('$state');
  const toaster = getAngularService('toaster');
  const { developer } = props;
  const { data, isLoading } = useFetchAttestationData();
  const crData = useFetchChangeRequestTypes();
  const { mutate } = usePostChangeRequest();
  const [attestationResponses, setAttestationResponses] = useState({});
  const [changeRequestType, setChangeRequestType] = useState({});
  const [signature, setSignature] = useState('');
  const [stage, setStage] = useState(0);
  const { user } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading) {
      setAttestationResponses([]);
      return;
    }
    setAttestationResponses(data.attestations
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((attestation) => ({
        attestation: {
          ...attestation,
          display: interpretLink(attestation.description),
          validResponses: attestation.validResponses.sort((a, b) => a.sortOrder - b.sortOrder),
        },
        response: { response: '' },
      })));
  }, [isLoading, data]);

  useEffect(() => {
    if (crData.isLoading) {
      return;
    }
    setChangeRequestType(crData.data.data.find((type) => type.name === 'Developer Attestation Change Request'));
  }, [crData.data, crData.isLoading]);

  const isFormFilledOut = () => attestationResponses.reduce((filledOut, attestation) => filledOut && !!attestation.response.id, true);

  const isSubmitDisabled = () => signature !== user.fullName;

  const canNext = () => stage === 0 || (stage === 1 && isFormFilledOut());

  const canPrevious = () => stage > 0 && stage < 3;

  const handleActionBarDispatch = () => {
    $state.go('organizations.developers.developer', { developerId: developer.developerId });
  };

  const handleProgressDispatch = (action) => setStage(stage + (action === 'next' ? 1 : -1));

  const handleSignature = (event) => {
    setSignature(event.target.value);
  };

  const handleResponse = (attestation, value) => {
    const updated = attestationResponses.map((att) => {
      const updatedAttestation = {
        ...att,
      };
      if (attestation.attestation.id === att.attestation.id) {
        updatedAttestation.response = att.attestation.validResponses.find((response) => response.response === value);
      }
      return updatedAttestation;
    });
    setAttestationResponses(updated);
  };

  const handleSubmit = () => {
    const payload = {
      changeRequestType,
      developer,
      details: {
        attestationResponses,
        signature,
      },
    };
    mutate(payload, {
      onSuccess: () => {
        setStage(3);
      },
      onError: (error) => {
        if (error.response.data.error?.startsWith('Email could not be sent to')) {
          toaster.pop({
            type: 'info',
            title: 'Notice',
            body: `${error.response.data.error} However, the changes have been applied`,
          });
          setStage(3);
        } else {
          const body = error.response.data?.error
            || error.response.data?.errorMessages.join(' ');
          toaster.pop({
            type: 'error',
            title: 'Error',
            body,
          });
        }
        // $scope.$apply(); // TODO - see if we can make these toast things MUI options
      },
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.listingInspectHeader}>
        <Typography gutterBottom variant="h1">
          Submit Attestation
        </Typography>
      </div>
      <ChplAttestationProgress
        dispatch={handleProgressDispatch}
        value={stage}
        canNext={canNext()}
        canPrevious={canPrevious()}
      />
      {stage === 0
        && (
          <>
            <br />
            <Container maxWidth="md">
              <Typography gutterBottom variant="h2">
                Introduction
              </Typography>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="body1">
                    <strong>The Conditions and Maintenance of Certification requirements express initial and ongoing requirements that a health IT developer of certified Health IT and its certified Health IT Module(s) must meet or adhere to in order to maintain their certification status in the ONC Health IT Certification Program (Program).
                    </strong>
                  </Typography>
                  <Divider />
                  <Typography gutterBottom variant="body1">
                    The Attestations Condition and Maintenance of Certification (&quot;Attestations&quot;) at &sect; 170.406 requires that a health IT developer of certified health IT, or its authorized representative that is capable of binding the health IT developer, must provide the Secretary of Health and Human Services an attestation of compliance with the following Conditions and Maintenance of Certification requirements. Attestations are submitted to ONC-Authorized Certification Bodies (ONC-ACBs) for review and subsequent submission to ONC for public availability.
                  </Typography>
                  <Typography variant="body1">
                    Please proceed to review the Attestations and indicate your (health IT developer’s) compliance, noncompliance, or the inapplicability of each Condition and Maintenance of Certification requirement. Note, per &sect; 170.580, under certain circumstances, ONC may directly review a health IT developer&apos;s actions or practices or its certified health IT to determine whether it conforms to the requirements of the Program. This may result in corrective action as necessary.  In addition, you may be subject to investigation by the HHS Office of the Inspector General for submitting a false attestation as specified in the 21st Century Cures Act.
                  </Typography>
                </CardContent>
              </Card>
              <br />
              <Typography variant="body2">
                For assistance with the Attestations submissions process, please visit the <Link>Health IT Feedback and Inquiry Portal</Link> to submit a ticket as applicable. For questions regarding the Attestations Condition and Maintenance of Certification requirement, please select the &quot;Attestations Condition&quot; category. For questions regarding a Condition and Maintenance of Certification requirement other than Attestations, please select the relevant Condition category. For technical assistance with this process, please select the &quot;CHPL&quot; category.
              </Typography>
            </Container>
          </>
        )}
      {stage === 1
        && (
          <>
            <Typography variant="h2">
              Attestations
            </Typography>
            {attestationResponses
              .map((attestation) => (
                <div key={attestation.attestation.id}>
                  <Typography variant="h3">
                    { attestation.attestation.condition.name }
                  </Typography>
                  <FormControl key={attestation.attestation.id} component="fieldset">
                    <FormLabel>{attestation.attestation.display}</FormLabel>
                    <RadioGroup
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
                          />
                        ))}
                    </RadioGroup>
                  </FormControl>
                </div>
              ))}
          </>
        )}
      {stage === 2
        && (
          <>
            <br />
            <Container maxWidth="md">
              <Typography gutterBottom variant="h2">
                Electronic Signature
              </Typography>
              <Card>
                <CardContent>
                  <div className={classes.electronicSignatureCheckboxItem}>
                    <Checkbox />
                    <Typography gutterBottom variant="body">
                      As a health IT developer of certified health IT, or as an authorized representative that is capable of binding the health IT developer, I certify the Attestations to the Secretary of Health and Human Services provided here are true and correct to the best of my knowledge and belief.
                    </Typography>
                  </div>
                  <div className={classes.electronicSignatureCheckboxItem}>
                    <Checkbox />
                    <Typography gutterBottom variant="body1">
                      I understand that under certain circumstances ONC may directly review the health IT developer&apos;s actions or practices or its certified health IT to determine whether it conforms to the requirements of the Program. This may result in corrective action as necessary.
                    </Typography>
                  </div>
                  <div className={classes.electronicSignatureCheckboxItem}>
                    <Checkbox />
                    <Typography gutterBottom variant="body1">
                      I also understand that I and my company may be subject to investigation by the HHS Office of the Inspector General for submitting a false attestation as specified in the 21st Century Cures Act.
                    </Typography>
                  </div>
                </CardContent>
              </Card>
              <br />
              <Typography gutterBottom variant="h4">
                Typing your name below signifies you are completing the Attestations using an electronic signature.
              </Typography>
              <Typography gutterBottom>To continue with the electronic signature process, please enter your name and click the &quot;Sign Electronically&quot; button to confirm and submit the Attestations to your ONC-Authorized Certification Body (ONC-ACB) for review.</Typography>
              <br />

              <div className={classes.userContext}>
                <Card>
                  <CardContent>
                    <div>
                      <Typography gutterBottom variant="subtitle1">
                        Name:
                      </Typography>
                      <Typography>{user.fullName}</Typography>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div>
                      <Typography gutterBottom variant="subtitle1">
                        Title:
                      </Typography>
                      <Typography>{user.title}</Typography>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <div>
                      <Typography gutterBottom variant="subtitle2">
                        Health IT Developer:
                      </Typography>
                      <Typography>{developer.name}</Typography>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <br />
              <div className={classes.signDateContainer}>
                <Card>
                  <CardContent>
                    <ChplTextField
                      id="signature"
                      name="signature"
                      label="Electronic Signature"
                      required
                      value={signature}
                      onChange={handleSignature}
                      helperText="Enter your name"
                      />
                  </CardContent>
                </Card>
                <Card>
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
              </div>
              <br />
              <Button
                fullWidth
                id="sign-electronically"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isSubmitDisabled()}
              >
                Sign Electronically
                <SaveIcon
                  className={classes.iconSpacing}
                />
              </Button>
            </Container>
          </>
        )
      }
      {
        stage === 3
        && (
          <>
            <Typography variant="h2">
              Confirmation
            </Typography>
            <Typography variant="body1">
              Thank you for your Attestations Condition and Maintenance of Certification submission for the ONC Health IT Certification Program. Please direct any inquiries regarding your submission to your ONC-Authorized Certification Body (ONC-ACB).
            </Typography>
          </>
        )
      }
      <ChplActionBar
        dispatch={handleActionBarDispatch}
        canCancel={stage !== 3}
        canClose={stage === 3}
        canSave={false}
      />
    </ThemeProvider >
  );
}

export default ChplAttestationCreate;

ChplAttestationCreate.propTypes = {
  developer: developerPropType.isRequired,
};
