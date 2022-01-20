import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import Moment from 'react-moment';

import ChplAttestationProgress from './attestation-progress';

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
});

function ChplAttestationCreate(props) {
  const $state = getAngularService('$state');
  const toaster = getAngularService('toaster');
  const { developer } = props;
  const { data, isLoading } = useFetchAttestationData();
  const crData = useFetchChangeRequestTypes();
  const { mutate } = usePostChangeRequest();
  const [changeRequestType, setChangeRequestType] = useState({});
  const [responses, setResponses] = useState({});
  const [signature, setSignature] = useState('');
  const [stage, setStage] = useState(0);
  const { user } = useContext(UserContext);
  const classes = useStyles();

  useEffect(() => {
    if (isLoading) {
      setResponses([]);
      return;
    }
    setResponses(data.categories
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .flatMap((category) => category.questions
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((question) => ({
          category,
          question,
          answers: question.answers.sort((a, b) => a.sortOrder - b.sortOrder),
          answer: {},
        }))));
  }, [isLoading, data]);

  useEffect(() => {
    if (crData.isLoading) {
      return;
    }
    setChangeRequestType(crData.data.data.find((type) => type.name === 'Developer Attestation Change Request'));
  }, [crData.data, crData.isLoading]);

  const isFormFilledOut = () => responses.reduce((filledOut, response) => filledOut && !!response.answer.id, true);

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

  const handleAnswer = (response, value) => {
    const updated = responses.map((rsp) => {
      const updatedResponse = {
        ...rsp,
      };
      if (response.question.id === rsp.question.id) {
        updatedResponse.answer = rsp.answers.find((answer) => answer.answer === value);
      }
      return updatedResponse;
    });
    setResponses(updated);
  };

  const handleSubmit = () => {
    const payload = {
      changeRequestType,
      developer,
      details: {
        responses,
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
      <Typography variant="h1">
        Submit Attestation
      </Typography>
      <ChplAttestationProgress
        dispatch={handleProgressDispatch}
        value={stage}
        canNext={canNext()}
        canPrevious={canPrevious()}
      />
      { stage === 0
        && (
          <>
            <Typography variant="h2">
              Introduction
            </Typography>
            <Typography variant="body1">
              The Conditions and Maintenance of Certification requirements express initial and ongoing requirements that a health IT developer of certified Health IT and its certified Health IT Module(s) must meet or adhere to in order to maintain their certification status in the ONC Health IT Certification Program (Program).
            </Typography>
            <Typography variant="body1">
              The Attestations Condition and Maintenance of Certification (&quot;Attestations&quot;) at &sect; 170.406 requires that a health IT developer of certified health IT, or its authorized representative that is capable of binding the health IT developer, must provide the Secretary of Health and Human Services an attestation of compliance with the following Conditions and Maintenance of Certification requirements. Attestations are submitted to ONC-Authorized Certification Bodies (ONC-ACBs) for review and subsequent submission to ONC for public availability.
            </Typography>
            <Typography variant="body1">
              Please proceed to review the Attestations and indicate your (health IT developer’s) compliance, noncompliance, or the inapplicability of each Condition and Maintenance of Certification requirement. Note, per &sect; 170.580, under certain circumstances, ONC may directly review a health IT developer&apos;s actions or practices or its certified health IT to determine whether it conforms to the requirements of the Program. This may result in corrective action as necessary.  In addition, you may be subject to investigation by the HHS Office of the Inspector General for submitting a false attestation as specified in the 21st Century Cures Act.
            </Typography>
            <Typography variant="body1">
              For assistance with the Attestations submissions process, please visit the Health IT Feedback and Inquiry Portal to submit a ticket as applicable.
            </Typography>
            <Typography variant="body1">
              For questions regarding the Attestations Condition and Maintenance of Certification requirement, please select the &quot;Attestations Condition&quot; category.
            </Typography>
            <Typography variant="body1">
              For questions regarding a Condition and Maintenance of Certification requirement other than Attestations, please select the relevant Condition category.
            </Typography>
            <Typography variant="body1">
              For technical assistance with this process, please select the &quot;CHPL&quot; category.
            </Typography>
          </>
        )}
      { stage === 1
        && (
          <>
            <Typography variant="h2">
              Attestations
            </Typography>
            {responses
              .map((response) => (
                <div key={response.category.id}>
                  <Typography variant="h3">
                    { response.category.name }
                  </Typography>
                  <FormControl key={response.question.id} component="fieldset">
                    <FormLabel>{response.question.question}</FormLabel>
                    <RadioGroup
                      name={`question-${response.question.id}`}
                      value={response.answer.answer}
                      onChange={(event) => handleAnswer(response, event.currentTarget.value)}
                    >
                      {response.answers
                        .map((answer) => (
                          <FormControlLabel
                            key={answer.id}
                            value={answer.answer}
                            control={<Radio />}
                            label={answer.answer}
                          />
                        ))}
                    </RadioGroup>
                  </FormControl>
                </div>
              ))}
          </>
        )}
      { stage === 2
        && (
        <>
          <Typography variant="h2">
            Electronic Signature
          </Typography>
          <Typography variant="body1">
            As a health IT developer of certified health IT, or as an authorized representative that is capable of binding the health IT developer, I certify the Attestations to the Secretary of Health and Human Services provided here are true and correct to the best of my knowledge and belief.
          </Typography>
          <Typography variant="body1">
            I understand that under certain circumstances ONC may directly review the health IT developer&apos;s actions or practices or its certified health IT to determine whether it conforms to the requirements of the Program. This may result in corrective action as necessary.
          </Typography>
          <Typography variant="body1">
            I also understand that I and my company may be subject to investigation by the HHS Office of the Inspector General for submitting a false attestation as specified in the 21st Century Cures Act.
          </Typography>
          <Typography variant="body1">
            Typing your name below signifies you are completing the Attestations using an electronic signature. To continue with the electronic signature process, please enter your name and click the &quot;Sign Electronically&quot; button to confirm and submit the Attestations to your ONC-Authorized Certification Body (ONC-ACB) for review.
          </Typography>
          <Typography variant="body1">
            Name:
            {' '}
            { user.fullName }
          </Typography>
          <Typography variant="body1">
            Title:
            {' '}
            { user.title }
          </Typography>
          <Typography variant="body1">
            Health IT Developer:
            {' '}
            { developer.name }
          </Typography>
          <ChplTextField
            id="signature"
            name="signature"
            label="Electronic Signature"
            required
            value={signature}
            onChange={handleSignature}
          />
          <Typography variant="body1">
            Date:
            {' '}
            <Moment
              date={Date.now()}
              format="DD MMM yyyy"
            />
          </Typography>
          <Button
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
        </>
        )}
      { stage === 3
        && (
        <>
          <Typography variant="h2">
            Confirmation
          </Typography>
          <Typography variant="body1">
            Thank you for your Attestations Condition and Maintenance of Certification submission for the ONC Health IT Certification Program. Please direct any inquiries regarding your submission to your ONC-Authorized Certification Body (ONC-ACB).
          </Typography>
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
