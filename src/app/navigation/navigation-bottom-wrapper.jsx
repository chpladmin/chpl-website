import React from 'react';

import ChplNavigationBottom from './navigation-bottom';

import AppWrapper from 'app-wrapper';

function ChplNavigationBottomWrapper() {
  return (
    <AppWrapper showQueryTools={false}>
      <ChplNavigationBottom />
    </AppWrapper>
  );
}

export default ChplNavigationBottomWrapper;

ChplNavigationBottomWrapper.propTypes = {
};
