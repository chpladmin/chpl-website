import React from 'react';
import {
  arrayOf, bool, func, object, string,
} from 'prop-types';

import ChplChangeRequests from './change-requests';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';
import { FlagContext } from 'shared/contexts';

function ChplChangeRequestsWrapper(props) {
  const {
    demographicChangeRequestIsOn,
    disallowedFilters,
    preFilter,
    scope,
  } = props;
  const flags = {
    demographicChangeRequestIsOn,
  };

  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagContext.Provider value={flags}>
          <ChplChangeRequests
            disallowedFilters={disallowedFilters}
            preFilter={preFilter}
            scope={scope}
          />
        </FlagContext.Provider>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplChangeRequestsWrapper;

ChplChangeRequestsWrapper.propTypes = {
  demographicChangeRequestIsOn: bool,
  disallowedFilters: arrayOf(string),
  preFilter: func,
  scope: object.isRequired, // eslint-disable-line react/forbid-prop-types
};

ChplChangeRequestsWrapper.defaultProps = {
  demographicChangeRequestIsOn: false,
  disallowedFilters: [],
  preFilter: () => true,
};
