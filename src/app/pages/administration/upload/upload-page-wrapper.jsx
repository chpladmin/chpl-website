import React from 'react';

import ChplUpload from './upload';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplUploadPageWrapper() {
  return (
    <>
      <ChplPageHeader text="Upload your files" />
      <ChplPageBody>
        <ChplUpload />
      </ChplPageBody>
    </>
  );
}

export default ChplUploadPageWrapper;

ChplUploadPageWrapper.propTypes = {
};
