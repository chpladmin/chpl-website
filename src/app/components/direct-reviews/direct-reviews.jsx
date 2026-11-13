import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';

import { useFetchDirectReviews } from 'api/developer';
import ChplDirectReviewsView from 'components/listing/details/compliance/direct-reviews';
import { ChplLoadingSection } from 'components/util';
import { AnalyticsContext, DeveloperContext, useAnalyticsContext } from 'shared/contexts';

function ChplDirectReviews() {
  const { analytics } = useAnalyticsContext();
  const { developer } = useContext(DeveloperContext);
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

  // Stands in for the whole card, title included, rather than sitting inside it
  if (isLoading) {
    return <ChplLoadingSection variant="table" columns={5} rows={3} />;
  }

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <Card>
        <CardHeader title="Direct Review Activities" />
        <CardContent>
          { !isSuccess
            && (
              <Typography>
                Direct Review information is not currently available, please check back later
              </Typography>
            )}
          { isSuccess
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
};
