import React from 'react';
import {
  arrayOf, func, object, string,
} from 'prop-types';

import { UserWrapper } from '../login';
import ApiWrapper from '../../api/api-wrapper';

import ChplChangeRequests from './change-requests';

function ChplChangeRequestsWrapper(props) {
  const { disallowedFilters, preFilter, scope } = props;
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplChangeRequests
          disallowedFilters={disallowedFilters}
          preFilter={preFilter}
          scope={scope}
        />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplChangeRequestsWrapper;

ChplChangeRequestsWrapper.propTypes = {
  disallowedFilters: arrayOf(string),
  preFilter: func,
  scope: object.isRequired, // eslint-disable-line react/forbid-prop-types
};

ChplChangeRequestsWrapper.defaultProps = {
  disallowedFilters: [],
  preFilter: () => true,
};
