import React from 'react';
import { func } from 'prop-types';

import ChplConfirmListings from './confirm-listings';

import ApiWrapper from 'api/api-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function ChplConfirmListingsWrapper(props) {
  const { onProcess } = props;

  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          <ChplConfirmListings
            onProcess={onProcess}
          />
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplConfirmListingsWrapper;

ChplConfirmListingsWrapper.propTypes = {
  onProcess: func.isRequired,
};
