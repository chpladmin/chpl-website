import React, { useEffect, useState } from 'react';

import ChplActivityView from './activity-view';

import { useFetchActivityData } from 'api/questionable-activity';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateTimeEntry,
} from 'components/filter';

const staticFilters = [{
  ...defaultFilter,
  key: 'activityDate',
  display: 'Activity Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'activityDateStart' : 'activityDateEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
}];

function ChplActivityPage() {
  const [filters, setFilters] = useState(staticFilters);
  const activityDataQuery = useFetchActivityData();

  useEffect(() => {
    if (activityDataQuery.isLoading || !activityDataQuery.isSuccess) {
      return;
    }
    const values = activityDataQuery.data
      .map((type) => ({
        ...type,
        value: type,
        display: type,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'concepts')
      .concat({
        ...defaultFilter,
        key: 'concepts',
        display: 'Activity Concept',
        values,
      }));
  }, [activityDataQuery.data, activityDataQuery.isLoading, activityDataQuery.isSuccess]);

  const analytics = {
    category: 'Activity',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-activity"
    >
      <ChplActivityView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplActivityPage;

ChplActivityPage.propTypes = {
};
