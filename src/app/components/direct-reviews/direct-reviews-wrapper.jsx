import React from 'react';
import { arrayOf, bool } from 'prop-types';

import ChplDirectReviews from './direct-reviews';

import AppWrapper from 'app-wrapper';
import { developer as developerPropType, directReview as directReviewPropType } from 'shared/prop-types';

function ChplDirectReviewsWrapper({ developer, directReviews, directReviewsAvailable }) {
  return (
    <AppWrapper>
      <ChplDirectReviews
        developer={developer}
        directReviews={directReviews}
        directReviewsAvailable={directReviewsAvailable}
      />
    </AppWrapper>
  );
}

export default ChplDirectReviewsWrapper;

ChplDirectReviewsWrapper.propTypes = {
  developer: developerPropType.isRequired,
  directReviews: arrayOf(directReviewPropType).isRequired,
  directReviewsAvailable: bool.isRequired,
};
