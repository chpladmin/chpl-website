import React from 'react';

import ChplCmsDisplay from './cms-display';

import AppWrapper from 'app-wrapper';

function ChplCmsDisplayWrapper() {
  return (
    <AppWrapper showQueryTools={false}>
      <ChplCmsDisplay />
    </AppWrapper>
  );
}

export default ChplCmsDisplayWrapper;

ChplCmsDisplayWrapper.propTypes = {
};
