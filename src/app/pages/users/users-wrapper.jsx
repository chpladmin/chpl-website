import React from 'react';

import ChplUsersPage from './users';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplUsersWrapper() {
  return (
    <>
      <ChplPageHeader text="CHPL Users" />
      <ChplPageBody>
        <ChplUsersPage />
      </ChplPageBody>
    </>
  );
}

export default ChplUsersWrapper;

ChplUsersWrapper.propTypes = { };
