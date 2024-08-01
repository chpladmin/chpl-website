import React from 'react';

import ChplHomePage from './home';

import AppWrapper from 'app-wrapper';

function ChplHomeWrapper() {
  return (
    <AppWrapper>
      <ChplHomePage />
    </AppWrapper>
  );
}

export default ChplHomeWrapper;

ChplHomeWrapper.propTypes = {
};
