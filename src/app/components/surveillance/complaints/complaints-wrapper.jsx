import React from 'react';
import { arrayOf, bool, string } from 'prop-types';

import ChplComplaints from './complaints';

import { ChplPageBody, ChplPageHeader } from 'components/util';
import AppWrapper from 'app-wrapper';

function ChplComplaintsWrapper(props) {
  const {
    bonusQuery = '',
    canAdd = true,
    disallowedFilters = [],
  } = props;

  return (
    <AppWrapper>
      <ChplPageHeader text="Surveillance Complaints" />
      <ChplPageBody>
        <ChplComplaints
          bonusQuery={bonusQuery}
          canAdd={canAdd}
          disallowedFilters={disallowedFilters}
        />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplComplaintsWrapper;

ChplComplaintsWrapper.propTypes = {
  bonusQuery: string,
  disallowedFilters: arrayOf(string),
  canAdd: bool,
};
