import React, { useState } from 'react';

import ChplManageSubscriptionsView from './manage-subscriptions-view';

import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateTimeEntry,
} from 'components/filter';
import {
  subscriberRoles,
  subscriberStatuses,
  subscriptionSubjects,
  subscriptionTypes,
} from 'components/filter/filters';

const staticFilters = [{
  ...defaultFilter,
  key: 'creationDateTime',
  display: 'Creation Date/Time',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'creationDateTimeStart' : 'creationDateTimeEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateTimeEntry,
},
subscriberRoles,
subscriberStatuses,
subscriptionSubjects,
subscriptionTypes,
];

function ChplManageSubscriptionsPage() {
  const [filters] = useState(staticFilters);

  const analytics = {
    category: 'Manage Subscriptions',
  };

  return (
    <FilterProvider
      analytics={analytics}
      filters={filters}
      storageKey="storageKey-manageSubscriptionsPage"
    >
      <ChplManageSubscriptionsView
        analytics={analytics}
      />
    </FilterProvider>
  );
}

export default ChplManageSubscriptionsPage;

ChplManageSubscriptionsPage.propTypes = {
};
