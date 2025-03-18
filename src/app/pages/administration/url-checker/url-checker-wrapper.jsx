import React from 'react';

import ChplUrlChecker from './url-checker';

import AppWrapper from 'app-wrapper';

function ChplUrlCheckerWrapper() {
  return (
    <AppWrapper>
      <ChplUrlChecker />
    </AppWrapper>
  );
}

export default ChplUrlCheckerWrapper;

ChplUrlCheckerWrapper.propTypes = {
};
