import React from 'react';
import { number } from 'prop-types';

import ChplSbul from './sbul';

import AppWrapper from 'app-wrapper';

function ChplSbulWrapper({ listingId }) {
  return (
    <AppWrapper>
      <ChplSbul
        listingId={listingId}
      />
    </AppWrapper>
  );
}

export default ChplSbulWrapper;

ChplSbulWrapper.propTypes = {
  listingId: number.isRequired,
};
