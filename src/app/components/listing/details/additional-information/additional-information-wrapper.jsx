import React from 'react';

import ChplAdditionalInformation from './additional-information';

import AppWrapper from 'app-wrapper';
import { listing as listingType } from 'shared/prop-types/listing';

function ChplAdditionalInformationWrapper(props) {
  const { listing } = props;

  return (
    <AppWrapper>
      <ChplAdditionalInformation listing={listing} />
    </AppWrapper>
  );
}

export default ChplAdditionalInformationWrapper;

ChplAdditionalInformationWrapper.propTypes = {
  listing: listingType.isRequired,
};
