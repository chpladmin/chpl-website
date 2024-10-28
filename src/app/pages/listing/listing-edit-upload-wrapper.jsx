import React from 'react';
import { number, oneOfType, string } from 'prop-types';

import ChplListingEditUploadPage from './listing-edit-upload';

import AppWrapper from 'app-wrapper';

function ChplListingEditUploadWrapper({ id }) {
  return (
    <AppWrapper>
      <ChplListingEditUploadPage
        id={id}
      />
    </AppWrapper>
  );
}

export default ChplListingEditUploadWrapper;

ChplListingEditUploadWrapper.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
