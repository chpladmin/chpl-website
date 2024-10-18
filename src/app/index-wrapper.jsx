import React from 'react';

import AppWrapper from './app-wrapper';
import ChplLoginRoot from './login-root';

function IndexWrapper() {
  return (
    <AppWrapper showQueryTools={false}>
      <ChplLoginRoot />
    </AppWrapper>
  );
}

export default IndexWrapper;
