import React from 'react';

import ChplListingsPage from './listings';

import AppWrapper from 'app-wrapper';

function ChplListingsWrapper() {
  return (
    <AppWrapper>
      <ChplListingsPage />
    </AppWrapper>
  );
}

export default ChplListingsWrapper;

ChplListingsWrapper.propTypes = {
};
