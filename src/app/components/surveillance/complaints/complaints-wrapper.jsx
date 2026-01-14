import React from 'react';
import { arrayOf, bool, string } from 'prop-types';

import ChplComplaints from './complaints';

import AppWrapper from 'app-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';

function ChplComplaintsWrapper(props = {
  bonusQuery: '',
  disallowedFilters: [],
  canAdd: true,
}) {
  const {
    bonusQuery,
    canAdd,
    disallowedFilters,
  } = props;

  return (
    <AppWrapper>
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
    </AppWrapper>
  );
}

export default ChplComplaintsWrapper;

ChplComplaintsWrapper.propTypes = {
  bonusQuery: string,
  disallowedFilters: arrayOf(string),
  canAdd: bool,
};
