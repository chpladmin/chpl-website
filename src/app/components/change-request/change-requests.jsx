import React, { useContext, useEffect, useState } from 'react';
import { arrayOf, string } from 'prop-types';

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
  key: 'currentStatusChangeDateTime',
  display: 'Last Updated',
  values: [
    { value: 'Before' },
    { value: 'After', default: '2022-01-01T00:00' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'currentStatusChangeDateTimeStart' : 'currentStatusChangeDateTimeEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
}, {
  ...defaultFilter,
  key: 'submittedDateTime',
  display: 'Creation Date',
  values: [
    { value: 'Before' },
    { value: 'After', default: '2022-01-01T00:00' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'submittedDateTimeStart' : 'submittedDateTimeEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
}];

function ChplChangeRequests(props) {
  const { disallowedFilters, bonusQuery } = props;
  const { isOn } = useContext(FlagContext);
  const [demographicChangeRequestIsOn, setDemographicChangeRequestIsOn] = useState(false);
  const [filters, setFilters] = useState(staticFilters);
  const crtQuery = useFetchChangeRequestTypes();

  useEffect(() => {
    setDemographicChangeRequestIsOn(isOn('demographic-change-request'));
  }, [isOn]);

  useEffect(() => {
    const values = (demographicChangeRequestIsOn) ? [
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
      .filter((filter) => filter.key !== 'currentStatusNames')
      .concat({
        ...defaultFilter,
        key: 'currentStatusNames',
        display: 'Change Request Status',
        values,
      }));
  }, [demographicChangeRequestIsOn]);

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
      .filter((filter) => filter.key !== 'changeRequestTypeNames')
      .concat({
        ...defaultFilter,
        key: 'changeRequestTypeNames',
        display: 'Change Request Type',
        values,
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
        bonusQuery={bonusQuery}
      />
    </FilterProvider>
  );
}

export default ChplChangeRequests;

ChplChangeRequests.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  bonusQuery: string.isRequired,
};
