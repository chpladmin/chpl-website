import React from 'react';

import ChplBannedDevelopersCollectionPage from './banned-developers';

import AppWrapper from 'app-wrapper';

function ChplBannedDevelopersCollectionWrapper() {
  return (
    <AppWrapper>
      <ChplBannedDevelopersCollectionPage />
    </AppWrapper>
  );
}

export default ChplBannedDevelopersCollectionWrapper;

ChplBannedDevelopersCollectionWrapper.propTypes = {
};
