import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
} from '@material-ui/core';

import { useFetchDirectReviews } from 'api/developer';
import ChplDirectReviewsView from 'components/listing/details/compliance/direct-reviews';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDirectReviews({ developer }) {
  const { analytics } = useAnalyticsContext();
  const [directReviews, setDirectReviews] = useState([]);
  const [directReviewsAvailable, setDirectReviewsAvailable] = useState(false);
  const { data, isLoading, isSuccess } = useFetchDirectReviews({ developer });

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setDirectReviews(data);
    setDirectReviewsAvailable(true);
  }, [data, isLoading, isSuccess]);

  const analyticsData = {
    analytics: {
      ...analytics,
      category: 'Developer',
      label: developer.name,
    },
  };

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <Card>
        <CardHeader title="Direct Review Activities" />
        <CardContent>
          { isLoading && <CircularProgress /> }
          { !isLoading && !isSuccess
            && (
              <Typography>
                Direct Review information is not currently available, please check back later
              </Typography>
            )}
          { !isLoading && isSuccess
            && (
              <>
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
              </>
            )}
        </CardContent>
      </Card>
    </AnalyticsContext.Provider>
  );
}

export default ChplDirectReviews;

ChplDirectReviews.propTypes = {
  developer: developerPropType.isRequired,
};
