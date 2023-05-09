import React from 'react';
import { arrayOf } from 'prop-types';

import ChplCompliance from './compliance';

import AppWrapper from 'app-wrapper';
import { directReview as directReviewPropType, surveillance as surveillancePropType } from 'shared/prop-types';

function ChplComplianceWrapper(props) {
  const { directReviews } = props;
  const { surveillance } = props;

  return (
    <AppWrapper>
      <ChplCompliance
        directReviews={directReviews}
        surveillance={surveillance}
      />
    </AppWrapper>
  );
}

export default ChplComplianceWrapper;

ChplComplianceWrapper.propTypes = {
  directReviews: arrayOf(directReviewPropType),
  surveillance: arrayOf(surveillancePropType),
};

ChplComplianceWrapper.defaultProps = {
  directReviews: [],
  surveillance: [],
};
