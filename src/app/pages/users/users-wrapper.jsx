import React from 'react';

import ChplUsersPage from './users';

import AppWrapper from 'app-wrapper';

function ChplUsersWrapper() {
  return (
    <AppWrapper>
      <ChplUsersPage />
    </AppWrapper>
  );
}

export default ChplUsersWrapper;

ChplUsersWrapper.propTypes = { };
