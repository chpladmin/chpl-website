import React from 'react';
import { arrayOf, bool } from 'prop-types';

import ChplCompliance from './compliance';

import AppWrapper from 'app-wrapper';
import { directReview as directReviewPropType, surveillance as surveillancePropType } from 'shared/prop-types';

function ChplComplianceWrapper({ directReviews, directReviewsAvailable, surveillance }) {
  return (
    <AppWrapper>
      <ChplCompliance
        directReviews={directReviews}
        directReviewsAvailable={directReviewsAvailable}
        surveillance={surveillance}
      />
    </AppWrapper>
  );
}

export default ChplComplianceWrapper;

ChplComplianceWrapper.propTypes = {
  directReviews: arrayOf(directReviewPropType),
  directReviewsAvailable: bool,
  surveillance: arrayOf(surveillancePropType),
};

ChplComplianceWrapper.defaultProps = {
  directReviews: [],
  directReviewsAvailable: true,
  surveillance: [],
};
