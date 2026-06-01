import React from 'react';

import ChplReports from './reports';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplReportsWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader text="Scheduled Reports" />
      <ChplPageBody>
        <ChplReports />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplReportsWrapper;

ChplReportsWrapper.propTypes = {
};
