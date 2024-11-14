import React from 'react';

import ChplApiKeys from './api-keys';

import AppWrapper from 'app-wrapper';

function ChplApiKeysWrapper() {
  return (
    <AppWrapper>
      <ChplApiKeys />
    </AppWrapper>
  );
}

export default ChplApiKeysWrapper;

ChplApiKeysWrapper.propTypes = {
};
