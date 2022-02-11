import React from 'react';
import {
  arrayOf, func, string,
} from 'prop-types';

import { UserWrapper } from '../login';
import ApiWrapper from '../../api/api-wrapper';

import ChplChangeRequests from './change-requests';

function ChplChangeRequestsWrapper(props) {
  const { disallowedFilters, preFilter } = props;
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplChangeRequests
          disallowedFilters={disallowedFilters}
          preFilter={preFilter}
        />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplChangeRequestsWrapper;

ChplChangeRequestsWrapper.propTypes = {
  disallowedFilters: arrayOf(string),
  preFilter: func,
};

ChplChangeRequestsWrapper.defaultProps = {
  disallowedFilters: [],
  preFilter: () => true,
};
