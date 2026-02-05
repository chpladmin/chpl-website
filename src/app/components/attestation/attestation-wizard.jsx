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

function ChplAttestationWizard({
  form: initialForm,
  isSubmitting: initialIsSubmitting = false,
  developer,
  dispatch,
  period: initialPeriod,
  stage: initialStage = 0,
}) {
  const [form, setForm] = useState({});
  const [sections, setSections] = useState([]);
  const [submission, setSubmission] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [period, setPeriod] = useState({});
  const [stage, setStage] = useState(0);

  useEffect(() => {
    setForm(initialForm);
    if (initialForm?.sectionHeadings) {
      setSections(initialForm.sectionHeadings.sort((a, b) => a.sortOrder - b.sortOrder));
      setSubmission(initialForm.sectionHeadings);
    }
  }, [initialForm]);

  useEffect(() => {
    setIsSubmitting(initialIsSubmitting);
  }, [initialIsSubmitting]);

  useEffect(() => {
    setPeriod(initialPeriod);
  }, [initialPeriod]);

  useEffect(() => {
    setSections(submission);
    setStage(initialStage);
  }, [initialStage]);

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
        attestationPeriod: period,
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
            instructions={form.instructions}
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
