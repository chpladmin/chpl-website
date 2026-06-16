import React from 'react';

import ChplUsersPage from './users';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplUsersWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader text="CHPL Users" />
      <ChplPageBody>
        <ChplUsersPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplUsersWrapper;

ChplUsersWrapper.propTypes = { };
