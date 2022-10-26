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
  key: 'atlContacted',
  display: 'ONC-ATL Contacted',
  values: [
    { value: 'Yes' },
    { value: 'No' },
  ],
}, {
  ...defaultFilter,
  key: 'certificationBodies',
  display: 'ONC-ACB',
  values: [
    { value: 'CCHIT', display: 'CCHIT (Retired)' },
    { value: 'Drummond Group', default: true },
    { value: 'ICSA Labs', default: true },
    { value: 'Leidos', default: true },
    { value: 'SLI Compliance', default: true },
    { value: 'Surescripts LLC', display: 'Surescripts LLC (Retired)' },
    { value: 'UL LLC', display: 'UL LLC (Retired)' },
  ],
}, {
  ...defaultFilter,
  key: 'complainantContacted',
  display: 'Complainant Contacted',
  values: [
    { value: 'Yes' },
    { value: 'No' },
  ],
}, {
  ...defaultFilter,
  key: 'complainantType',
  display: 'Complainant Type',
  values: [
    { value: 'Anonymous' },
    { value: 'Developer' },
    { value: 'Government Entity' },
    { value: 'Other - [Please Describe]' },
    { value: 'Patient' },
    { value: 'Provider' },
    { value: 'Third Party Organization' },
  ],
}, {
  ...defaultFilter,
  key: 'closedDate',
  display: 'Closed Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'closedDateTimeStart' : 'closedDateTimeEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
}, {
  ...defaultFilter,
  key: 'developerContacted',
  display: 'Developer Contacted',
  values: [
    { value: 'Yes' },
    { value: 'No' },
  ],
}, {
  ...defaultFilter,
  key: 'informedOnc',
  display: 'Informed ONC',
  values: [
    { value: 'Yes' },
    { value: 'No' },
  ],
}, {
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
}, {
  ...defaultFilter,
  key: 'status',
  display: 'Status',
  values: [
    { value: 'Closed' },
    { value: 'Open' },
  ],
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
