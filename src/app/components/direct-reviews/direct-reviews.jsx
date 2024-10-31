import React from 'react';
import { arrayOf, bool } from 'prop-types';

import ChplDirectReviewsView from './direct-reviews-view';

import ChplDirectReviewsOther from 'components/listing/details/compliance/direct-reviews';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';
import { directReview as directReviewPropType } from 'shared/prop-types';

function ChplDirectReviews({ directReviews, directReviewsAvailable }) {
  const { analytics } = useAnalyticsContext();

  const data = {
    analytics: {
      ...analytics,
      category: 'Developer',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <ChplDirectReviewsView
        directReviews={directReviews}
      />
      <ChplDirectReviewsOther
        directReviews={directReviews}
        directReviewsAvailable={directReviewsAvailable}
      />
    </AnalyticsContext.Provider>
  );
}

export default ChplDirectReviews;

ChplDirectReviews.propTypes = {
  directReviews: arrayOf(directReviewPropType).isRequired,
  directReviewsAvailable: bool.isRequired,
};
