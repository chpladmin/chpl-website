import React from 'react';

import ChplReports from './reports';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplReportsWrapper() {
  return (
    <>
      <ChplPageHeader text="Scheduled Reports" />
      <ChplPageBody>
        <ChplReports />
      </ChplPageBody>
    </>
  );
}

export default ChplReportsWrapper;

ChplReportsWrapper.propTypes = {
};
