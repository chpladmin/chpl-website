import React from 'react';
import {
  arrayOf, bool, func, string,
} from 'prop-types';

import ChplChangeRequests from './change-requests';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplChangeRequestsWrapper(props) {
  const {
    disallowedFilters = [],
    bonusQuery = '',
    dispatch = () => {},
    useFooterSpacing = true,
  } = props;

  return (
    <AppWrapper>
      <ChplPageHeader text="Change Requests" />
      <ChplPageBody>
        <ChplChangeRequests
          disallowedFilters={disallowedFilters}
          bonusQuery={bonusQuery}
          dispatch={dispatch}
          useFooterSpacing={useFooterSpacing}
        />
      </ChplPageBody>
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
