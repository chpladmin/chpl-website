import React, { useEffect, useState } from 'react';
import {
  bool,
  func,
  number,
  object,
  shape,
  string,
} from 'prop-types';

import ChplAttestationProgress from './attestation-progress';
import ChplAttestationWizardSection1 from './attestation-wizard-section-1';
import ChplAttestationWizardSection2 from './attestation-wizard-section-2';
import ChplAttestationWizardSection3 from './attestation-wizard-section-3';
import ChplAttestationWizardSection4 from './attestation-wizard-section-4';

import { ChplActionBar } from 'components/action-bar';
import { developer as developerPropType } from 'shared/prop-types';

const completedFormItems = (section) => section
  .formItems
  .reduce((completed, item) => completed && (!item.required || item.submittedResponses.length > 0),
    section.formItems.length > 0);

const isFormFilledOut = (submission) => submission
  .reduce((completed, section) => completed && completedFormItems(section),
    true);

function ChplAttestationWizard(props) {
  const { developer, dispatch } = props;
  const [form, setForm] = useState({});
  const [sections, setSections] = useState([]);
  const [submission, setSubmission] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [period, setPeriod] = useState({});
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setForm(props.form);
    if (props.form?.sectionHeadings) {
      setSections(props.form.sectionHeadings.sort((a, b) => a.sortOrder - b.sortOrder));
      setSubmission(props.form.sectionHeadings);
    }
  }, [props.form]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setIsSubmitting(props.isSubmitting);
  }, [props.isSubmitting]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setPeriod(props.period);
  }, [props.period]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setSections(submission);
    setStage(props.stage);
  }, [props.stage]); // eslint-disable-line react/destructuring-assignment

  const canNext = () => stage === 0 || (stage === 1 && isFormFilledOut(submission));

  const canPrevious = () => stage > 0 && stage < 3;

  const handleActionBarDispatch = () => {
    dispatch('close');
  };

  const handleFormDispatch = (payload) => {
    setSubmission(payload);
  };

  const handleProgressDispatch = (action) => dispatch('stage', (stage + (action === 'next' ? 1 : -1)));

  const handleSignatureDispatch = (signature) => {
    const payload = {
      details: {
        form: {
          ...form,
          sectionHeadings: submission,
        },
        period,
        signature,
      },
    };
    dispatch('submit', payload);
  };

  return (
    <>
      <ChplAttestationProgress
        dispatch={handleProgressDispatch}
        value={stage}
        canNext={canNext()}
        canPrevious={canPrevious()}
      />
      { stage === 0
        && (
          <ChplAttestationWizardSection1 />
        )}
      { stage === 1
        && (
          <ChplAttestationWizardSection2
            sections={sections}
            dispatch={handleFormDispatch}
          />
        )}
      { stage === 2
        && (
          <ChplAttestationWizardSection3
            developer={developer}
            isSubmitting={isSubmitting}
            dispatch={handleSignatureDispatch}
          />
        )}
      { stage === 3
        && (
          <ChplAttestationWizardSection4
            developer={developer}
          />
        )}
      <ChplActionBar
        dispatch={handleActionBarDispatch}
        canCancel={stage !== 3}
        canClose={stage === 3}
        canSave={false}
      />
    </>
  );
}

export default ChplAttestationWizard;

ChplAttestationWizard.propTypes = {
  form: object.isRequired, // eslint-disable-line react/forbid-prop-types
  isSubmitting: bool,
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
  period: shape({
    periodStart: string,
    periodEnd: string,
  }).isRequired,
  stage: number,
};

ChplAttestationWizard.defaultProps = {
  isSubmitting: false,
  stage: 0,
};
