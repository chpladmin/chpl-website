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
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplAttestationProgress from './attestation-progress';

import {
  useFetchAttestationData,
} from 'api/attestations';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

const validationSchema = yup.object({
  question1: yup.string()
    .required('Question 1 is required'),
  question2: yup.string()
    .required('Question 2 is required'),
  question3: yup.string()
    .required('Question 3 is required'),
  question4: yup.string()
    .required('Question 4 is required'),
  question5: yup.string()
    .required('Question 5 is required'),
  signature: yup.string()
    .required('Signature is required'),
});

function ChplAttestationCreate(props) {
  const { developer } = props;
  const { isLoading, data } = useFetchAttestationData();
  const [value, setValue] = useState(0);
  const [canNext, setCanNext] = useState(true);
  const [canPrevious, setCanPrevious] = useState(false);
  const [signature, setSignature] = useState('');
  const { user } = useContext(UserContext);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setCanNext(value < 2);
    setCanPrevious(value > 0 && value < 3);
  }, [value]);

  const handleActionBarDispatch = (action) => {
    switch (action) {
      case 'cancel':
        setValue(0);
        console.log('TODO: go back to Developer page');
        break;
        // no default
    }
  };

  const handleChange = (event) => {
    setSignature(event.target.value);
  };

  const handleProgressDispatch = (action) => {
    switch (action) {
      case 'next':
        setValue(value + 1);
        break;
      case 'previous':
        setValue(value - 1);
        break;
        // no default
    }
  };

  const handleSubmit = () => {
    console.log('TODO: submit attestation change request, then navigate to confirmation (on success)');
    setValue(3);
  };

  const isNextDisabled = () =>
        value === 2 || (value === 1 && !formik.isValid);

  const isSubmitDisabled = () => signature !== user.fullName;

  const setFieldValue = (name, value) => {
    console.log(formik, formik.isValid);
    formik.setFieldValue(name, value);
  };

  formik = useFormik({
    initialValues: {
      question1: '',
      question2: '',
      question3: '',
      question4: '',
      question5: '',
      signature: '',
    },
    onSubmit: () => { },
    validationSchema,
  });

  return (
    <ThemeProvider theme={theme}>
      <Typography variant="h1">
        Submit Attestation
      </Typography>
      <ChplAttestationProgress
        dispatch={handleProgressDispatch}
        value={value}
        canNext={canNext}
        canPrevious={canPrevious}
      />
      { value === 0
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
      { value === 1
        && (
        <>
          <Typography variant="h2">
            Attestations
          </Typography>
          {data.categories
           .sort((a, b) => a.sortOrder - b.sortOrder)
           .map((category, idx) => (
            <div key={category.id}>
              <Typography variant="h3">
                { category.name }
              </Typography>
              {category.questions
               .sort((a, b) => a.sortOrder - b.sortOrder)
               .map((question) => (
                 <FormControl key={question.id} component="fieldset">
                   <FormLabel>{question.question}</FormLabel>
                   <RadioGroup
                     name={`question${idx + 1}`}
                     value={formik.values[`question${idx + 1}`]}
                     onChange={(event) => setFieldValue(`question${idx + 1}`, event.currentTarget.value)}
                   >
                     {question.answers
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map((answer) => (
                        <FormControlLabel
                          key={answer.id}
                          value={answer.answer}
                          control={<Radio />}
                          label={answer.answer} />
                      ))}
                   </RadioGroup>
                 </FormControl>
               ))}
            </div>
          ))}
        </>
        )}
      { value === 2
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
            onChange={handleChange}
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
      { value === 3
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
        isDisabled={isNextDisabled()}
        canCancel={value !== 3}
        canClose={value === 3}
        canSave={false}
      />
    </ThemeProvider>
  );
}

export default ChplAttestationCreate;

ChplAttestationCreate.propTypes = {
  developer: developerPropType.isRequired,
};
