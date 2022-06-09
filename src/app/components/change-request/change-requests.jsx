import React, { useContext, useEffect, useState } from 'react';
import {
  arrayOf, func, string,
} from 'prop-types';

import ChplChangeRequestsView from './change-requests-view';

import { useFetchChangeRequestTypes } from 'api/change-requests';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateTimeEntry,
} from 'components/filter';
import { FlagContext } from 'shared/contexts';

const analytics = {
  category: 'Change Requests',
};

const staticFilters = [{
  ...defaultFilter,
  key: 'currentStatusChangeDate',
  display: 'Last Updated',
  values: [
    { value: 'Before' },
    { value: 'After', default: '2022-01-01T00:00' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'currentStatusChangeDateStart' : 'currentStatusChangeDateEnd'}=${v.selected}`)
    .join('&'),
  meets: (item, values) => {
    const canMeet = values
      .filter((value) => value.selected)
      .reduce((can, value) => can && (value.value === 'Before' ? item.currentStatusChangeDate < (new Date(value.selected)).getTime() : (new Date(value.selected)).getTime() < item.currentStatusChangeDate), true);
    return canMeet;
  },
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
}, {
  ...defaultFilter,
  key: 'submittedDate',
  display: 'Creation Date',
  values: [
    { value: 'Before' },
    { value: 'After', default: '2022-01-01T00:00' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'submittedDateStart' : 'submittedDateEnd'}=${v.selected}`)
    .join('&'),
  meets: (item, values) => {
    const canMeet = values
      .filter((value) => value.selected)
      .reduce((can, value) => can && (value.value === 'Before' ? item.submittedDate < (new Date(value.selected)).getTime() : (new Date(value.selected)).getTime() < item.submittedDate), true);
    return canMeet;
  },
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
}];

function ChplChangeRequests(props) {
  const { disallowedFilters, preFilter, bonusQuery } = props;
  const { isOn } = useContext(FlagContext);
  const [attestationsEditIsOn, setAttestationsEditIsOn] = useState(false);
  const [demographicChangeRequestIsOn, setDemographicChangeRequestIsOn] = useState(false);
  const [filters, setFilters] = useState(staticFilters);
  const crtQuery = useFetchChangeRequestTypes();

  useEffect(() => {
    setAttestationsEditIsOn(isOn('attestations-edit'));
    setDemographicChangeRequestIsOn(isOn('demographic-change-request'));
  }, [isOn]);

  useEffect(() => {
    const values = (attestationsEditIsOn || demographicChangeRequestIsOn) ? [
      { value: 'Accepted' },
      { value: 'Cancelled by Requester' },
      { value: 'Pending Developer Action', default: true },
      { value: 'Pending ONC-ACB Action', default: true },
      { value: 'Rejected' },
    ] : [
      { value: 'Accepted' },
      { value: 'Cancelled by Requester' },
      { value: 'Pending ONC-ACB Action', default: true },
      { value: 'Rejected' },
    ];
    setFilters((f) => f
      .filter((filter) => filter.key !== 'currentStatusName')
      .concat({
        ...defaultFilter,
        key: 'currentStatusName',
        display: 'Change Request Status',
        values,
        meets: (item, vs) => {
          const canMeet = vs
            .filter((value) => value.selected)
            .map((value) => value.value);
          return canMeet.length === 0 || canMeet.includes(item.currentStatusName);
        },
      }));
  }, [attestationsEditIsOn, demographicChangeRequestIsOn]);

  useEffect(() => {
    setFilters((f) => f.filter((filter) => !disallowedFilters.includes(filter.key)));
  }, [disallowedFilters]);

  useEffect(() => {
    if (crtQuery.isLoading || !crtQuery.isSuccess) {
      return;
    }
    const values = crtQuery.data.data
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((type) => ({
        value: type.name,
      }));
    if (values.length <= 1) {
      return;
    }
    setFilters((f) => f
      .filter((filter) => filter.key !== 'changeRequestTypeName')
      .concat({
        ...defaultFilter,
        key: 'changeRequestTypeName',
        display: 'Change Request Type',
        values,
        meets: (item, vs) => {
          const canMeet = vs
            .filter((value) => value.selected)
            .map((value) => value.value);
          return canMeet.length === 0 || canMeet.includes(item.changeRequestTypeName);
        },
      }));
  }, [crtQuery.data, crtQuery.isLoading, crtQuery.isSuccess]);

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
    >
      <ChplChangeRequestsView
        analytics={analytics}
        disallowedFilters={disallowedFilters}
        preFilter={preFilter}
        bonusQuery={bonusQuery}
      />
    </FilterProvider>
  );
}

export default ChplChangeRequests;

ChplChangeRequests.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  preFilter: func.isRequired,
  bonusQuery: string.isRequired,
};
