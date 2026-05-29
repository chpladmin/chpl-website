import React from 'react';
import { func } from 'prop-types';

import ChplConfirmListings from './confirm-listings';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplConfirmListingsWrapper(props) {
  const { onProcess } = props;

  return (
    <AppWrapper>
      <ChplPageHeader text="View Products in the process of upload" />
      <ChplPageBody>
        <ChplConfirmListings
          onProcess={onProcess}
        />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplConfirmListingsWrapper;

ChplConfirmListingsWrapper.propTypes = {
  onProcess: func.isRequired,
};
