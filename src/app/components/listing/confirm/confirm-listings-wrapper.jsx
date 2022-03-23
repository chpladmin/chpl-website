import React from 'react';
import { bool, func } from 'prop-types';

import ChplConfirmListings from './confirm-listings';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';

function ChplConfirmListingsWrapper(props) {
  const { beta, onProcess } = props;
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplConfirmListings
          beta={beta}
          onProcess={onProcess}
        />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplConfirmListingsWrapper;

ChplConfirmListingsWrapper.propTypes = {
  beta: bool,
  onProcess: func.isRequired,
};

ChplConfirmListingsWrapper.defaultProps = {
  beta: false,
};
