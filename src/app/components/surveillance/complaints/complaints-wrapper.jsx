import React from 'react';
import { arrayOf, bool, string } from 'prop-types';

import ChplComplaints from './complaints';

import ApiWrapper from 'api/api-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';
import { UserWrapper } from 'components/login';

function ChplComplaintsWrapper(props) {
  const {
    bonusQuery,
    canAdd,
    disallowedFilters,
  } = props;

  return (
    <UserWrapper>
      <ApiWrapper>
        <BreadcrumbWrapper
          disabled={!!bonusQuery}
          title="Complaints Reporting"
        >
          <ChplComplaints
            bonusQuery={bonusQuery}
            canAdd={canAdd}
            disallowedFilters={disallowedFilters}
          />
        </BreadcrumbWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplComplaintsWrapper;

ChplComplaintsWrapper.propTypes = {
  bonusQuery: string,
  disallowedFilters: arrayOf(string),
  canAdd: bool,
};

ChplComplaintsWrapper.defaultProps = {
  bonusQuery: '',
  disallowedFilters: [],
  canAdd: true,
};
