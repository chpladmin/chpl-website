import React from 'react';
import { number, oneOfType, string } from 'prop-types';

import ChplListingEditPage from './listing-edit';

import AppWrapper from 'app-wrapper';

function ChplListingEditWrapper({ id }) {
  return (
    <AppWrapper>
      <ChplListingEditPage
        id={id}
      />
    </AppWrapper>
  );
}

export default ChplListingEditWrapper;

ChplListingEditWrapper.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
