import React from 'react';

import ChplUrlCheckerPage from './url-checker-page';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplUrlCheckerWrapper() {
  return (
    <>
      <ChplPageHeader text="URL Checker" subtitle="Validate a URL" />
      <ChplPageBody>
        <ChplUrlCheckerPage />
      </ChplPageBody>
    </>
  );
}

export default ChplUrlCheckerWrapper;

ChplUrlCheckerWrapper.propTypes = {
};
