import React from 'react';
import { arrayOf } from 'prop-types';

import ChplDirectReviewsView from './direct-reviews-view';

import AppWrapper from 'app-wrapper';
import { directReview as directReviewPropType } from 'shared/prop-types';

function ChplDirectReviewsWrapper(props) {
  const { directReviews } = props;

  return (
    <AppWrapper>
      <ChplDirectReviewsView
        directReviews={directReviews}
      />
    </AppWrapper>
  );
}

export default ChplDirectReviewsWrapper;

ChplDirectReviewsWrapper.propTypes = {
  directReviews: arrayOf(directReviewPropType),
};

ChplDirectReviewsWrapper.defaultProps = {
  directReviews: [],
};
