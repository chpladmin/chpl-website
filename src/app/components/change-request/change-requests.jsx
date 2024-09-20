import React, { useEffect, useState } from 'react';
import { arrayOf, string } from 'prop-types';

import ChplChangeRequestsView from './change-requests-view';

import { useFetchChangeRequestTypes } from 'api/change-requests';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateTimeEntry,
} from 'components/filter';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';

const staticFilters = [{
  ...defaultFilter,
  key: 'currentStatusChangeDateTime',
  display: 'Last Updated',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'currentStatusChangeDateTimeStart' : 'currentStatusChangeDateTimeEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
}, {
  ...defaultFilter,
  key: 'currentStatusNames',
  display: 'Change Request Status',
  values: [
    { value: 'Accepted' },
    { value: 'Cancelled by Requester' },
    { value: 'Pending Developer Action', default: true },
    { value: 'Pending ONC-ACB Action', default: true },
    { value: 'Rejected' },
  ],
}, {
  ...defaultFilter,
  key: 'submittedDateTime',
  display: 'Creation Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
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
  const { analytics } = useAnalyticsContext();
  const [filters, setFilters] = useState(staticFilters);
  const crtQuery = useFetchChangeRequestTypes();

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

  const data = {
    analytics: {
      ...analytics,
      category: 'CHPL Search - Change Requests',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <FilterProvider
        analytics={data.analytics}
        filters={filters}
        storageKey="storageKey-changeRequestsComponent"
      >
        <ChplChangeRequestsView
          analytics={analytics}
          disallowedFilters={disallowedFilters}
          bonusQuery={bonusQuery}
        />
      </FilterProvider>
    </AnalyticsContext.Provider>
  );
}

export default ChplChangeRequests;

ChplChangeRequests.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  bonusQuery: string.isRequired,
};
