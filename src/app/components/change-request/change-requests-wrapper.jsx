import React from 'react';
import {
  arrayOf, bool, func, string,
} from 'prop-types';

import ChplChangeRequests from './change-requests';

import AppWrapper from 'app-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';

function ChplChangeRequestsWrapper(props) {
  const {
    disallowedFilters = [],
    bonusQuery = '',
    dispatch = () => {},
    useFooterSpacing = true,
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
          useFooterSpacing={useFooterSpacing}
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
  useFooterSpacing: bool,
};
