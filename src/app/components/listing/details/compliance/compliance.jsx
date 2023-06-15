import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { arrayOf, bool } from 'prop-types';

import ChplDirectReviews from './direct-reviews';
import ChplSurveillance from './surveillance';

import { directReview as directReviewPropType, surveillance as surveillancePropType } from 'shared/prop-types';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplCompliance({ directReviews, directReviewsAvailable, surveillance }) {
  const classes = useStyles();

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle">
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
