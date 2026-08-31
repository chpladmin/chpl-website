import React, { useContext, useEffect, useState } from 'react';

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
import { FlagContext } from 'shared/contexts';

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
  const { hti5ErdIsOn } = useContext(FlagContext);
  const [filters, setFilters] = useState(staticFilters);

  useEffect(() => {
    if (!hti5ErdIsOn) {
      setFilters((prev) => [
        ...prev.filter((f) => f.key !== 'subscriptionSubjects'),
        {
          ...defaultFilter,
          key: 'subscriptionSubjects',
          display: 'Subscription Subject',
          values: [
            { value: 'Certification Status Changed' },
            { value: 'Certification Criterion Added' },
            { value: 'Certification Criterion Removed' },
            { value: 'RWT Plans URL Changed' },
            { value: 'RWT Results URL Changed' },
            { value: 'Service Base URL List Changed' },
          ],
        },
      ]);
    }
  }, [hti5ErdIsOn]);

  const analytics = {
    category: 'Manage Subscriptions',
  };

  return (
    <FilterProvider
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
