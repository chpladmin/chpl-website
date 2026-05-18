import React from 'react';

import ChplNavigationTop from './navigation-top';

import AppWrapper from 'app-wrapper';

function ChplNavigationTopWrapper() {
  return (
    <AppWrapper showQueryTools={false}>
      <ChplNavigationTop />
    </AppWrapper>
  );
}

export default ChplNavigationTopWrapper;

ChplNavigationTopWrapper.propTypes = {
};
