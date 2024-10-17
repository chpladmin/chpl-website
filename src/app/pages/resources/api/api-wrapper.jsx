import React from 'react';

import ChplResourcesApi from './api';

import AppWrapper from 'app-wrapper';

function ChplApiWrapper() {
  return (
    <AppWrapper>
      <ChplResourcesApi />
    </AppWrapper>
  );
}

export default ChplApiWrapper;

ChplApiWrapper.propTypes = {
};
