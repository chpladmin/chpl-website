import React from 'react';

import ChplCms from './cms';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplCmsWrapper() {
  return (
    <>
      <ChplPageHeader text="CMS Management" />
      <ChplPageBody>
        <ChplCms />
      </ChplPageBody>
    </>
  );
}

export default ChplCmsWrapper;

ChplCmsWrapper.propTypes = {
};
