import React from 'react';

import ChplUploadListings from './upload-listings';

import AppWrapper from 'app-wrapper';

function ChplUploadWrapper() {
  return (
    <AppWrapper>
      <ChplUploadListings />
    </AppWrapper>
  );
}

export default ChplUploadWrapper;

ChplUploadWrapper.propTypes = {
};
