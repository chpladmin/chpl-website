import React from 'react';

import ChplUrlCheckerPage from './url-checker-page';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplUrlCheckerWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader text="URL Checker" subtitle="Validate a URL" />
      <ChplPageBody>
        <ChplUrlCheckerPage />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplUrlCheckerWrapper;

ChplUrlCheckerWrapper.propTypes = {
};
