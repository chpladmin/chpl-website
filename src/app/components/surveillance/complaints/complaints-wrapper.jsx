import React from 'react';
import { arrayOf, bool, string } from 'prop-types';

import ChplComplaints from './complaints';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplComplaintsWrapper(props) {
  const {
    bonusQuery = '',
    canAdd = true,
    disallowedFilters = [],
  } = props;

  return (
    <>
      <ChplPageHeader text="Complaints Reporting" />
      <ChplPageBody>
        <ChplComplaints
          bonusQuery={bonusQuery}
          canAdd={canAdd}
          disallowedFilters={disallowedFilters}
        />
      </ChplPageBody>
    </>
  );
}

export default ChplComplaintsWrapper;

ChplComplaintsWrapper.propTypes = {
  bonusQuery: string,
  disallowedFilters: arrayOf(string),
  canAdd: bool,
};
