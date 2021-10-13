import React from 'react';

import { UserWrapper } from '../login';
import ApiWrapper from '../../api/api-wrapper';

import ChplChangeRequests from './change-requests';

function ChplChangeRequestsWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplChangeRequests />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplChangeRequestsWrapper;

ChplChangeRequestsWrapper.propTypes = {
};
