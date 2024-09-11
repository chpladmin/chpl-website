import React from 'react';

import ChplBannedDevelopersSearchPage from './banned-developers';

import AppWrapper from 'app-wrapper';

function ChplBannedDevelopersSearchWrapper() {
  return (
    <AppWrapper>
      <ChplBannedDevelopersSearchPage />
    </AppWrapper>
  );
}

export default ChplBannedDevelopersSearchWrapper;

ChplBannedDevelopersSearchWrapper.propTypes = {
};
