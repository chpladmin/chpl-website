import React from 'react';

import { UserWrapper } from '../login';
import ChplChangeRequests from './change-requests';
import ApiWrapper from '../../api/api-wrapper';

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
