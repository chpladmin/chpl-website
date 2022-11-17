import React from 'react';

import ChplInactiveCertificatesCollectionPage from './inactive-certificates';

import AppWrapper from 'app-wrapper';

function ChplInactiveCertificatesCollectionWrapper() {
  return (
    <AppWrapper>
      <ChplInactiveCertificatesCollectionPage />
    </AppWrapper>
  );
}

export default ChplInactiveCertificatesCollectionWrapper;

ChplInactiveCertificatesCollectionWrapper.propTypes = {
};
