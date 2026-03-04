import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  number,
  object,
  shape,
  string,
} from 'prop-types';

import ChplSbulProgress from './sbul-progress';
import ChplSbulWizardSection1 from './sbul-wizard-section-1';
import ChplSbulWizardSection2 from './sbul-wizard-section-2';
import ChplSbulWizardSection3 from './sbul-wizard-section-3';
import ChplSbulWizardSection4 from './sbul-wizard-section-4';

import { ChplActionBar } from 'components/action-bar';
import { developer as developerPropType } from 'shared/prop-types';

function ChplSbulWizard({
  isSubmitting: initialIsSubmitting = false,
  dispatch,
  listings,
  stage = 0,
}) {
  const [submission, setSubmission] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsSubmitting(initialIsSubmitting);
  }, [initialIsSubmitting]);

  const canNext = () => stage < 3;

  const canPrevious = () => stage > 0 && stage < 3;

  const handleActionBarDispatch = () => {
    dispatch('close');
  };

  const handleFormDispatch = (payload) => {
    setSubmission(payload);
  };

  const handleProgressDispatch = (action) => dispatch('stage', (stage + (action === 'next' ? 1 : -1)));

  const handleUrlDispatch = (url) => {
    const payload = {
      details: {
        url,
      },
    };
    dispatch('submit', payload);
  };

  return (
    <>
      <ChplSbulProgress
        dispatch={handleProgressDispatch}
        value={stage}
        canNext={canNext()}
        canPrevious={canPrevious()}
      />
      { stage === 0
        && (
          <ChplSbulWizardSection1 />
        )}
      { stage === 1
        && (
          <ChplSbulWizardSection2
            listings={listings}
            dispatch={handleFormDispatch}
          />
        )}
      { stage === 2
        && (
          <ChplSbulWizardSection3
            isSubmitting={isSubmitting}
            dispatch={handleUrlDispatch}
          />
        )}
      { stage === 3
        && (
          <ChplSbulWizardSection4 />
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

export default ChplSbulWizard;

ChplSbulWizard.propTypes = {
  isSubmitting: bool,
  dispatch: func.isRequired,
  listings: arrayOf(object).isRequired,
  stage: number,
};
