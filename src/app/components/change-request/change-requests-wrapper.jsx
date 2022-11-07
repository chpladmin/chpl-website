import React from 'react';
import { arrayOf, string } from 'prop-types';

import ChplChangeRequests from './change-requests';

import AppWrapper from 'app-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';

function ChplChangeRequestsWrapper(props) {
  const {
    disallowedFilters,
    bonusQuery,
  } = props;

  return (
    <AppWrapper>
      <BreadcrumbWrapper
        disabled={!!bonusQuery}
        title="Change Requests"
      >
        <ChplChangeRequests
          disallowedFilters={disallowedFilters}
          bonusQuery={bonusQuery}
        />
      </BreadcrumbWrapper>
    </AppWrapper>
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
