import React from 'react';

import ChplDevelopers from './developers';

import { UserWrapper } from 'components/login';
import ApiWrapper from 'api/api-wrapper';

function ChplDevelopersWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplDevelopers />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplDevelopersWrapper;

ChplDevelopersWrapper.propTypes = {
};
