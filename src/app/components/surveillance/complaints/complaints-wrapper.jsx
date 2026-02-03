import React from 'react';
import { arrayOf, bool, string } from 'prop-types';

import ChplComplaints from './complaints';

import AppWrapper from 'app-wrapper';

function ChplComplaintsWrapper(props) {
  const {
    bonusQuery = '',
    canAdd = true,
    disallowedFilters = [],
  } = props;

  return (
    <AppWrapper>
      <ChplComplaints
        bonusQuery={bonusQuery}
        canAdd={canAdd}
        disallowedFilters={disallowedFilters}
      />
    </AppWrapper>
  );
}

export default ChplComplaintsWrapper;

ChplComplaintsWrapper.propTypes = {
  bonusQuery: string,
  disallowedFilters: arrayOf(string),
  canAdd: bool,
};
