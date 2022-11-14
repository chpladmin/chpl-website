import React from 'react';

import ChplJobs from './jobs';

import AppWrapper from 'app-wrapper';

function ChplJobsWrapper() {
  return (
    <AppWrapper>
      <ChplJobs />
    </AppWrapper>
  );
}

export default ChplJobsWrapper;

ChplJobsWrapper.propTypes = {
};
