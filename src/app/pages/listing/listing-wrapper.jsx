import React from 'react';
import { number } from 'prop-types';

import ChplListingPage from './listing';

import AppWrapper from 'app-wrapper';

function ChplListingWrapper({ id }) {
  return (
    <AppWrapper>
      <ChplListingPage id={id} />
    </AppWrapper>
  );
}

export default ChplListingWrapper;

ChplListingWrapper.propTypes = {
  id: number.isRequired,
};
