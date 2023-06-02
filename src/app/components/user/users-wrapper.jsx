import React from 'react';

import ChplUsers from './users';

import AppWrapper from 'app-wrapper';

function ChplUsersWrapper() {
  return (
    <AppWrapper>
      <ChplUsers />
    </AppWrapper>
  );
}

export default ChplUsersWrapper;

ChplUsersWrapper.propTypes = {
};
