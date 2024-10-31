import React from 'react';
import { arrayOf, bool } from 'prop-types';

import ChplDirectReviews from './direct-reviews';

import AppWrapper from 'app-wrapper';
import { directReview as directReviewPropType } from 'shared/prop-types';

function ChplDirectReviewsWrapper({ directReviews, directReviewsAvailable }) {
  return (
    <AppWrapper>
      <ChplDirectReviews
        directReviews={directReviews}
        directReviewsAvailable={directReviewsAvailable}
      />
    </AppWrapper>
  );
}

export default ChplDirectReviewsWrapper;

ChplDirectReviewsWrapper.propTypes = {
  directReviews: arrayOf(directReviewPropType).isRequired,
  directReviewsAvailable: bool.isRequired,
};
