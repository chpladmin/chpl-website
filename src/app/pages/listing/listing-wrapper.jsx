import React from 'react';
import { number, oneOfType, string } from 'prop-types';

import ChplListingPage from './listing';

function ChplListingWrapper({ id }) {
  return (
    <>
      <ChplListingPage
        id={id}
      />
    </>
  );
}

export default ChplListingWrapper;

ChplListingWrapper.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
