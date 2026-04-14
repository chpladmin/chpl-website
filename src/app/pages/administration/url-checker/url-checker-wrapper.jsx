import React from 'react';

import ChplUrlCheckerPage from './url-checker-page';

import AppWrapper from 'app-wrapper';

function ChplUrlCheckerWrapper() {
  return (
    <AppWrapper>
      <ChplUrlCheckerPage />
    </AppWrapper>
  );
}

export default ChplUrlCheckerWrapper;

ChplUrlCheckerWrapper.propTypes = {
};
