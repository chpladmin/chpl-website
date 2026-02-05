import React from 'react';
import { arrayOf, func, string } from 'prop-types';

import ChplChangeRequests from './change-requests';

import AppWrapper from 'app-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';

function ChplChangeRequestsWrapper(props) {
  const {
    disallowedFilters = [],
    bonusQuery = '',
    dispatch = () => {},
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
          dispatch={dispatch}
        />
      </BreadcrumbWrapper>
    </AppWrapper>
  );
}

export default ChplChangeRequestsWrapper;

ChplChangeRequestsWrapper.propTypes = {
  disallowedFilters: arrayOf(string),
  bonusQuery: string,
  dispatch: func,
};
