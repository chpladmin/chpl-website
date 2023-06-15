import React from 'react';
import {
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { arrayOf, bool } from 'prop-types';

import ChplDirectReviews from './direct-reviews';
import ChplSurveillance from './surveillance';

import { directReview as directReviewPropType, surveillance as surveillancePropType } from 'shared/prop-types';

function ChplCompliance({ directReviews, directReviewsAvailable, surveillance }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1">
          Compliance Activities
        </Typography>
        <ChplSurveillance surveillance={surveillance} />
        <ChplDirectReviews directReviews={directReviews} directReviewsAvailable={directReviewsAvailable} />
      </CardContent>
    </Card>
  );
}

export default ChplCompliance;

ChplCompliance.propTypes = {
  directReviews: arrayOf(directReviewPropType).isRequired,
  directReviewsAvailable: bool.isRequired,
  surveillance: arrayOf(surveillancePropType).isRequired,
};
