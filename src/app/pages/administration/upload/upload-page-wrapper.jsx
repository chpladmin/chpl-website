import React from 'react';

import ChplUpload from './upload';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplUploadPageWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader text="Upload your files" />
      <ChplPageBody>
        <ChplUpload />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplUploadPageWrapper;

ChplUploadPageWrapper.propTypes = {
};
