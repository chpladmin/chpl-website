import React from 'react';

import ChplDevelopersPage from './developers';

import AppWrapper from 'app-wrapper';

function ChplDevelopersWrapper() {
  return (
    <AppWrapper>
      <ChplDevelopersPage />
    </AppWrapper>
  );
}

export default ChplDevelopersWrapper;

ChplDevelopersWrapper.propTypes = {
};
