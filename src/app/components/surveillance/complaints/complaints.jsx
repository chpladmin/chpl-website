import React, { useContext, useEffect, useState } from 'react';
import {
  ButtonGroup,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, string } from 'prop-types';

import ChplComplaintsView from './complaints-view';

import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateTimeEntry,
} from 'components/filter';
import { complaint as complaintPropType, listing as listingPropType } from 'shared/prop-types';

const analytics = {
  category: 'Complaints',
};

const staticFilters = [{
  ...defaultFilter,
  key: 'receivedDate',
  display: 'Received Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'receivedDateTimeStart' : 'receivedDateTimeEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
}];

function ChplComplaints(props) {
  const { disallowedFilters, bonusQuery } = props;
  const [filters, setFilters] = useState(staticFilters);

  useEffect(() => {
    setFilters((f) => f.filter((filter) => !disallowedFilters.includes(filter.key)));
  }, [disallowedFilters]);

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-complaintsComponent"
    >
      <ChplComplaintsView
        analytics={analytics}
        disallowedFilters={disallowedFilters}
        bonusQuery={bonusQuery}
      />
    </FilterProvider>
  );

}

export default ChplComplaints;

ChplComplaints.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  bonusQuery: string.isRequired,
};

/*
    
  return (
    <>
      <div className={classes.tableResultsHeaderContainer}>
        <ButtonGroup size="small" className={classes.wrap}>
          { displayAdd
            && (
              <ChplComplaintAdd
                dispatch={dispatch}
              />
            )}
          { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'])
            && (
              <ChplComplaintsDownload />
            )}
        </ButtonGroup>
      </div>
      <ChplComplaintsView
        complaints={complaints}
        dispatch={dispatch}
      />
    </>
  );*/
