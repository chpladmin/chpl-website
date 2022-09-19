import React from 'react';

import ChplCms from './cms';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';

function ChplCmsWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplCms />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplCmsWrapper;

ChplCmsWrapper.propTypes = {
};
