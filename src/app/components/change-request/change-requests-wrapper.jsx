import React from 'react';
import { arrayOf, string } from 'prop-types';

import ChplChangeRequests from './change-requests';

import ApiWrapper from 'api/api-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';
import FlagWrapper from 'api/flag-wrapper';
import { UserWrapper } from 'components/login';

function ChplChangeRequestsWrapper(props) {
  const {
    disallowedFilters,
    bonusQuery,
  } = props;

  return (
    <UserWrapper>
      <ApiWrapper>
        <FlagWrapper>
          <BreadcrumbWrapper
            disabled={!!bonusQuery}
            title="Change Requests"
          >
            <ChplChangeRequests
              disallowedFilters={disallowedFilters}
              bonusQuery={bonusQuery}
            />
          </BreadcrumbWrapper>
        </FlagWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplChangeRequestsWrapper;

ChplChangeRequestsWrapper.propTypes = {
  disallowedFilters: arrayOf(string),
  bonusQuery: string,
};

ChplChangeRequestsWrapper.defaultProps = {
  disallowedFilters: [],
  bonusQuery: '',
};
