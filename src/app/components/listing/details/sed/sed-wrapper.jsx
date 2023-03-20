import React from 'react';
import { arrayOf, bool } from 'prop-types';

import ChplSed from './sed';

import AppWrapper from 'app-wrapper';
import { listing as listingType } from 'shared/prop-types/listing';

function ChplSedWrapper(props) {
  const { listing } = props;

  return (
    <AppWrapper>
      <ChplSed listing={listing} />
    </AppWrapper>
  );
}

export default ChplSedWrapper;

ChplSedWrapper.propTypes = {
  listing: listingType.isRequired,
};
