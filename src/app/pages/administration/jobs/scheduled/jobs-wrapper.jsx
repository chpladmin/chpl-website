import React from 'react';

import ChplJobs from './jobs';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';

function ChplJobsWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplJobs />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplJobsWrapper;

ChplJobsWrapper.propTypes = {
};
