import React from 'react';
import { object } from 'prop-types';

import { UserWrapper } from '../login';
import ApiWrapper from '../../api/api-wrapper';

import ChplChangeRequests from './change-requests';

function ChplChangeRequestsWrapper(props) {
  const { scope } = props;
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplChangeRequests scope={scope} />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplChangeRequestsWrapper;

ChplChangeRequestsWrapper.propTypes = {
  scope: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
