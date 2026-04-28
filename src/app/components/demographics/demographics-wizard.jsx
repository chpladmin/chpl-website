import React, { useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  number,
  object,
  string,
} from 'prop-types';

import ChplDemographicsProgress from './demographics-progress';
import ChplDemographicsWizardSection1 from './demographics-wizard-section-1';
import ChplDemographicsWizardSection2 from './demographics-wizard-section-2';
import ChplDemographicsWizardSection3 from './demographics-wizard-section-3';

import { ChplActionBar } from 'components/action-bar';

function ChplDemographicsWizard({
  isSubmitting = false,
  dispatch,
  stage = 0,
  errors = [],
}) {

  const canNext = () => stage === 0;

  const canPrevious = () => stage > 0 && stage < 2;

  const handleActionBarDispatch = () => {
    dispatch('close');
  };

  const handleProgressDispatch = (action) => dispatch('stage', (stage + (action === 'next' ? 1 : -1)));

  const handleEditDispatch = (payload) => {
    console.log({ payload });
    dispatch('submit', payload);
  };

  return (
    <>
      <ChplDemographicsProgress
        dispatch={handleProgressDispatch}
        value={stage}
        canNext={canNext()}
        canPrevious={canPrevious()}
      />
      { stage === 0
        && (
          <ChplDemographicsWizardSection1 />
        )}
      { stage === 1
        && (
          <ChplDemographicsWizardSection2
            isSubmitting={isSubmitting}
            dispatch={handleEditDispatch}
          />
        )}
      { stage === 2
        && (
          <ChplDemographicsWizardSection3 />
        )}
      <ChplActionBar
        dispatch={handleActionBarDispatch}
        errors={errors}
        canCancel={stage !== 2}
        canClose={stage === 2}
        canSave={false}
        isProcessing={isSubmitting}
      />
    </>
  );
}

export default ChplDemographicsWizard;

ChplDemographicsWizard.propTypes = {
  isSubmitting: bool,
  dispatch: func.isRequired,
  stage: number,
  errors: arrayOf(string),
};
