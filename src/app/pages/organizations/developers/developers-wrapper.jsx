import React from 'react';

import ChplDevelopersPage from './developers';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplDevelopersWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader text="CHPL Developers" />
      <ChplPageBody>
        <ChplDevelopersPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplDevelopersWrapper;

ChplDevelopersWrapper.propTypes = {
};
