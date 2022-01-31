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
  Radio,
  RadioGroup,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import BorderColorIcon from '@material-ui/icons/BorderColor';
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
  pageHeader: {
    padding: '8px 0',
  },
  nonCaps: {
    textTransform: 'none',
  },
  radioGroup: {
    flexDirection: 'row',
    textTransform: 'none',
  },
  attestationContainer: {
    display: 'grid',
    rowGap: '16px',
    columnGap: '32px',
    justifyContent: 'stretch',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gridTemplateRows: 'auto',
    gridTemplateAreas: '"header header header header header header" "certification certification certification certification certification certification" "instruction instruction instruction instruction instruction instruction" "continue continue continue continue continue continue" "name name title title developer developer" "signature signature signature signature signature date" "b b b b b b"',
  },
  headerContainer: {
    gridArea: 'header',
  },
  certificationContainer: {
    gridArea: 'certification',
  },
  instructionContainer: {
    gridArea: 'instruction',
  },
  continueContainer: {
    gridArea: 'continue',
  },
  nameContainer: {
    gridArea: 'name',
  },
  titleContainer: {
    gridArea: 'title',
  },
  developerContainer: {
    gridArea: 'developer',
  },
  signatureContainer: {
    gridArea: 'signature',
  },
  dateContainer: {
    gridArea: 'date',
  },
  buttonContainer: {
    gridArea: 'b',
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
      <Container className={classes.pageHeader} maxWidth="md">
        <Typography gutterBottom variant="h1">
          Submit Attestation
        </Typography>
      </Container>
      <ChplAttestationProgress
        dispatch={handleProgressDispatch}
        value={stage}
        canNext={canNext()}
        canPrevious={canPrevious()}
      />
      { stage === 0
        && (
          <>
            <Container maxWidth="md">
              <Typography gutterBottom variant="h2">
                Introduction
              </Typography>
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="body1">
                    <strong>
                      The Conditions and Maintenance of Certification requirements express initial and ongoing requirements that a health IT developer of certified Health IT and its certified Health IT Module(s) must meet or adhere to in order to maintain their certification status in the ONC Health IT Certification Program (Program).
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
              <Typography variant="body2">
                For assistance with the Attestations submissions process, please visit the
                {' '}
                <a href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51">Health IT Feedback and Inquiry Portal</a>
                {' '}
                to submit a ticket as applicable. For questions regarding the Attestations Condition and Maintenance of Certification requirement, please select the &quot;Attestations Condition&quot; category. For questions regarding a Condition and Maintenance of Certification requirement other than Attestations, please select the relevant Condition category. For technical assistance with this process, please select the &quot;CHPL&quot; category.
              </Typography>
            </Container>
          </>
        )}
      { stage === 1
        && (
          <>
            <Container maxWidth="md">
              <Typography gutterBottom variant="h2">
                Attestations
              </Typography>
              <Card>
                <CardContent>
                  {attestationResponses
                    .map((attestation, idx) => (
                      <div key={attestation.attestation.id}>
                        <Typography variant="subtitle1">
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
                    ))}
                </CardContent>
              </Card>
            </Container>
          </>
        )}
      { stage === 2
        && (
          <>
            <Container maxWidth="md" className={classes.attestationContainer}>
              <Typography variant="h2" className={classes.headerContainer}>
                Electronic Signature
              </Typography>
              <Card className={classes.certificationContainer}>
                <CardContent>
                  <Typography variant="body1">
                    As a health IT developer of certified health IT, or as an authorized representative that is capable of binding the health IT developer, I certify the Attestations to the Secretary of Health and Human Services provided here are true and correct to the best of my knowledge and belief.
                    I understand that under certain circumstances ONC may directly review the health IT developer&apos;s actions or practices or its certified health IT to determine whether it conforms to the requirements of the Program. This may result in corrective action as necessary.
                    I also understand that I and my company may be subject to investigation by the HHS Office of the Inspector General for submitting a false attestation as specified in the 21st Century Cures Act.
                  </Typography>
                </CardContent>
              </Card>
              <Typography variant="h4" className={classes.instructionContainer}>
                Typing your name below signifies you are completing the Attestations using an electronic signature.
              </Typography>
              <Typography className={classes.continueContainer}>
                To continue with the electronic signature process, please enter your name and click the &quot;Sign Electronically&quot; button to confirm and submit the Attestations to your ONC-Authorized Certification Body (ONC-ACB) for review.
              </Typography>
              <Card className={classes.nameContainer}>
                <CardContent>
                  <div>
                    <Typography gutterBottom variant="subtitle1">
                      Name:
                    </Typography>
                    <Typography variant="body1">{user.fullName}</Typography>
                  </div>
                </CardContent>
              </Card>
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
              <Card className={classes.developerContainer}>
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
                    helperText="Enter your name"
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
              <div className={classes.buttonContainer}>
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
          </>
        )}
      { stage === 3
        && (
          <>
            <Container maxWidth="md">
              <Typography gutterBottom variant="h2">Confirmation</Typography>
              <Card>
                <CardContent>
                  <Typography variant="body1">Thank you for your Attestations Condition and Maintenance of Certification submission for the ONC Health IT Certification Program. Please direct any inquiries regarding your submission to your ONC-Authorized Certification Body (ONC-ACB).</Typography>
                </CardContent>
              </Card>
            </Container>
          </>
        )}
      <ChplActionBar
        dispatch={handleActionBarDispatch}
        canCancel={stage !== 3}
        canClose={stage === 3}
        canSave={false}
      />
    </ThemeProvider>
  );
}

export default ChplAttestationCreate;

ChplAttestationCreate.propTypes = {
  developer: developerPropType.isRequired,
};
