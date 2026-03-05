import React, { useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  number,
  object,
} from 'prop-types';

import ChplSbulProgress from './sbul-progress';
import ChplSbulWizardSection1 from './sbul-wizard-section-1';
import ChplSbulWizardSection2 from './sbul-wizard-section-2';
import ChplSbulWizardSection3 from './sbul-wizard-section-3';
import ChplSbulWizardSection4 from './sbul-wizard-section-4';

import { ChplActionBar } from 'components/action-bar';

function ChplSbulWizard({
  isSubmitting = false,
  dispatch,
  listings,
  stage = 0,
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
            dispatch={handleListingDispatch}
            selectedListings={selectedListings}
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
