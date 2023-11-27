import React, { useState } from 'react';

import ChplManageSubscriptionsView from './manage-subscriptions-view';

import { FilterProvider } from 'components/filter';
import {
  subscriberRoles,
  subscriberStatuses,
  subscriptionSubjects,
  subscriptionTypes,
} from 'components/filter/filters';

const staticFilters = [
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
