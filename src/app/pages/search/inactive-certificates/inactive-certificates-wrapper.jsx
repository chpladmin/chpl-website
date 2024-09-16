import React from 'react';

import ChplInactiveCertificatesSearchPage from './inactive-certificates';

import AppWrapper from 'app-wrapper';

function ChplInactiveCertificatesSearchWrapper() {
  return (
    <AppWrapper>
      <ChplInactiveCertificatesSearchPage />
    </AppWrapper>
  );
}

export default ChplInactiveCertificatesSearchWrapper;

ChplInactiveCertificatesSearchWrapper.propTypes = {
};
