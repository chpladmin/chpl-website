import React from 'react';
import { func } from 'prop-types';

import ChplConfirmListings from './confirm-listings';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplConfirmListingsWrapper(props) {
  const { onProcess } = props;

  return (
    <>
      <ChplPageHeader text="View Products in the process of upload" />
      <ChplPageBody>
        <ChplConfirmListings
          onProcess={onProcess}
        />
      </ChplPageBody>
    </>
  );
}

export default ChplConfirmListingsWrapper;

ChplConfirmListingsWrapper.propTypes = {
  onProcess: func.isRequired,
};
