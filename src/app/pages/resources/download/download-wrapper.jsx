import React from 'react';

import ChplDownload from './download';

import { UserWrapper } from 'components/login';

function ChplDownloadWrapper() {
  return (
    <UserWrapper>
      <ChplDownload />
    </UserWrapper>
  );
}

export default ChplDownloadWrapper;

ChplDownloadWrapper.propTypes = {
};
