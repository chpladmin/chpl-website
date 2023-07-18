import React from 'react';
import { bool } from 'prop-types';

import ChplAdditionalInformation from './additional-information';

import AppWrapper from 'app-wrapper';
import { listing as listingType } from 'shared/prop-types/listing';

function ChplAdditionalInformationWrapper(props) {
  const { isConfirming, listing } = props;

  return (
    <AppWrapper>
      <ChplAdditionalInformation
        isConfirming={isConfirming}
        listing={listing}
      />
    </AppWrapper>
  );
}

export default ChplAdditionalInformationWrapper;

ChplAdditionalInformationWrapper.propTypes = {
  isConfirming: bool,
  listing: listingType.isRequired,
};

ChplAdditionalInformationWrapper.defaultProps = {
  isConfirming: false,
};
