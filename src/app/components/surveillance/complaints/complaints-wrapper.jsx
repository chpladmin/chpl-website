import React from 'react';
import { arrayOf, string } from 'prop-types';

import ChplComplaints from './complaints';

import ApiWrapper from 'api/api-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';
import { UserWrapper } from 'components/login';

function ChplComplaintsWrapper(props) {
  const {
    disallowedFilters,
    bonusQuery,
  } = props;

  return (
    <UserWrapper>
      <ApiWrapper>
        <BreadcrumbWrapper
          disabled={!!bonusQuery}
          title="Complaints"
        >
          <ChplComplaints
            disallowedFilters={disallowedFilters}
            bonusQuery={bonusQuery}
          />
        </BreadcrumbWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplComplaintsWrapper;

ChplComplaintsWrapper.propTypes = {
  disallowedFilters: arrayOf(string),
  bonusQuery: string,
};

ChplComplaintsWrapper.defaultProps = {
  disallowedFilters: [],
  bonusQuery: '',
};
