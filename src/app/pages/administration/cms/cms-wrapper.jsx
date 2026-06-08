import React from 'react';

import ChplCms from './cms';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplCmsWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader text="CMS Management" />
      <ChplPageBody>
        <ChplCms />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplCmsWrapper;

ChplCmsWrapper.propTypes = {
};
