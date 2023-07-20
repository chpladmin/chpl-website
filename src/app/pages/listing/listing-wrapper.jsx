import React from 'react';
import { number, oneOfType, string } from 'prop-types';

import ChplListingPage from './listing';

import AppWrapper from 'app-wrapper';

function ChplListingWrapper({ id }) {
  return (
    <AppWrapper>
      <ChplListingPage
        id={id}
      />
    </AppWrapper>
  );
}

export default ChplListingWrapper;

ChplListingWrapper.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
