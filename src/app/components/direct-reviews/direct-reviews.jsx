import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core';
import { arrayOf, bool } from 'prop-types';

import ChplDirectReviewsView from 'components/listing/details/compliance/direct-reviews';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';
import { developer as developerPropType, directReview as directReviewPropType } from 'shared/prop-types';

function ChplDirectReviews({ developer, directReviews, directReviewsAvailable }) {
  const { analytics } = useAnalyticsContext();

  const data = {
    analytics: {
      ...analytics,
      category: 'Developer',
      label: developer.name,
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <Card>
        <CardHeader title="Direct Review Activities" />
        <CardContent>
          { directReviews.length > 0
            && (
              <ChplDirectReviewsView
                directReviews={directReviews}
                directReviewsAvailable={directReviewsAvailable}
                isListing={false}
              />
            )}
          { directReviews.length === 0
            && (
              <Typography>
                No Direct Reviews have been conducted
              </Typography>
            )}
        </CardContent>
      </Card>
    </AnalyticsContext.Provider>
  );
}

export default ChplDirectReviews;

ChplDirectReviews.propTypes = {
  developer: developerPropType.isRequired,
  directReviews: arrayOf(directReviewPropType).isRequired,
  directReviewsAvailable: bool.isRequired,
};
