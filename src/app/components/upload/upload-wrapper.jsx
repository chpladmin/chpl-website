import React from 'react';

import ChplUploadListings from './upload-listings';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function ChplUploadWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          <ChplUploadListings />
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplUploadWrapper;

ChplUploadWrapper.propTypes = {
};
