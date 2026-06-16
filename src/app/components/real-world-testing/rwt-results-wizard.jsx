import React, { useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  number,
  object,
  string,
} from 'prop-types';

import ChplRwtResultsProgress from './rwt-results-progress';
import ChplRwtResultsWizardSection1 from './rwt-results-wizard-section-1';
import ChplRwtResultsWizardSection2 from './rwt-results-wizard-section-2';
import ChplRwtResultsWizardSection3 from './rwt-results-wizard-section-3';
import ChplRwtResultsWizardSection4 from './rwt-results-wizard-section-4';

import { ChplActionBar } from 'components/action-bar';

function ChplRwtResultsWizard({
  isSubmitting = false,
  dispatch,
  listings,
  stage = 0,
  errors = [],
}) {
  const [selectedListings, setSelectedListings] = useState(new Set());

  const canNext = () => stage === 0 || (stage === 1 && selectedListings.size > 0);

  const canPrevious = () => stage > 0 && stage < 3;

  const handleActionBarDispatch = () => {
    dispatch('close');
  };

  const handleListingDispatch = (payload) => {
    setSelectedListings((prev) => {
      const next = new Set(prev);
      if (next.has(payload)) {
        next.delete(payload);
      } else {
        next.add(payload);
      }
      return next;
    });
  };

  const handleProgressDispatch = (action) => dispatch('stage', (stage + (action === 'next' ? 1 : -1)));

  const handleUrlDispatch = (url) => {
    const payload = {
      details: {
        selectedListings: listings.filter((l) => selectedListings.has(l.id)),
        url,
      },
    };
    dispatch('submit', payload);
  };

  return (
    <>
      <ChplRwtResultsProgress
        dispatch={handleProgressDispatch}
        value={stage}
        canNext={canNext()}
        canPrevious={canPrevious()}
      />
      { stage === 0
        && (
          <ChplRwtResultsWizardSection1 />
        )}
      { stage === 1
        && (
          <ChplRwtResultsWizardSection2
            listings={listings}
            dispatch={handleListingDispatch}
            selectedListings={selectedListings}
          />
        )}
      { stage === 2
        && (
          <ChplRwtResultsWizardSection3
            isSubmitting={isSubmitting}
            dispatch={handleUrlDispatch}
          />
        )}
      { stage === 3
        && (
          <ChplRwtResultsWizardSection4 />
        )}
      <ChplActionBar
        dispatch={handleActionBarDispatch}
        errors={errors}
        canCancel={stage !== 3}
        canClose={stage === 3}
        canSave={false}
        isProcessing={isSubmitting}
      />
    </>
  );
}

export default ChplRwtResultsWizard;

ChplRwtResultsWizard.propTypes = {
  isSubmitting: bool,
  dispatch: func.isRequired,
  listings: arrayOf(object).isRequired,
  stage: number,
  errors: arrayOf(string),
};
