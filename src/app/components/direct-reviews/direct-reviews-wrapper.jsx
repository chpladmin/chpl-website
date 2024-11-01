import React from 'react';

import ChplDirectReviews from './direct-reviews';

import AppWrapper from 'app-wrapper';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDirectReviewsWrapper({ developer }) {
  return (
    <AppWrapper>
      <ChplDirectReviews
        developer={developer}
      />
    </AppWrapper>
  );
}

export default ChplDirectReviewsWrapper;

ChplDirectReviewsWrapper.propTypes = {
  developer: developerPropType.isRequired,
};
