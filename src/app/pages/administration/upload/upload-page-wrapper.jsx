import React from 'react';

import ChplUpload from './upload.jsx';

import AppWrapper from 'app-wrapper';

function ChplUploadPageWrapper() {
  return (
    <AppWrapper>
        <ChplUpload />
    </AppWrapper>
  );
}

export default ChplUploadPageWrapper;

ChplUploadPageWrapper.propTypes = {
};