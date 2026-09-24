import React from 'react';

import ChplDevelopersPage from './developers';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplDevelopersWrapper() {
  return (
    <>
      <ChplPageHeader text="CHPL Developers" />
      <ChplPageBody>
        <ChplDevelopersPage />
      </ChplPageBody>
    </>
  );
}

export default ChplDevelopersWrapper;

ChplDevelopersWrapper.propTypes = {
};
