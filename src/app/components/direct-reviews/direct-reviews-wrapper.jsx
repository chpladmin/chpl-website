import React from 'react';

import ChplDirectReviews from './direct-reviews';

import AppWrapper from 'app-wrapper';
import { DeveloperContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDirectReviewsWrapper({ developer }) {
  const developerState = {
    developer,
  };

  return (
    <AppWrapper>
      <DeveloperContext.Provider value={developerState}>
        <ChplDirectReviews />
      </DeveloperContext.Provider>
    </AppWrapper>
  );
}

export default ChplDirectReviewsWrapper;

ChplDirectReviewsWrapper.propTypes = {
  developer: developerPropType.isRequired,
};
