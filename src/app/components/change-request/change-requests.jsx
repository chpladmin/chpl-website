import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';

import ChplChangeRequestsView from './change-requests-view';

import {
  useFetchChangeRequestTypes,
} from 'api/change-requests';
import ApiWrapper from 'api/api-wrapper';
import { FilterProvider } from 'components/filter';
import { UserWrapper } from 'components/login';

const analytics = {
  category: 'Change Requests',
};

function ChplChangeRequests(props) {
  const { scope } = props;
  const [filters, setFilters] = useState([{
    key: 'changeRequestStatusType',
    display: 'Change Request Status',
    values: [
      { value: 'Accepted' },
      { value: 'Cancelled by Requester' },
      { value: 'Pending Developer Action', default: true },
      { value: 'Pending ONC-ACB Action', default: true },
      { value: 'Rejected' },
    ],
  }]);
  const crtQuery = useFetchChangeRequestTypes();

  useEffect(() => {
    if (crtQuery.isLoading || !crtQuery.isSuccess) {
      return;
    }
    const values = crtQuery.data.data
      .sort((a, b) => (a.name < b.name ? -1 : 1))
      .map((type) => ({
        value: type.name,
      }));
    setFilters((f) => f
      .filter((filter) => filter.key !== 'changeRequestType')
      .concat({
        key: 'changeRequestType',
        display: 'Change Request Type',
        values,
      }));
  }, [crtQuery.data, crtQuery.isLoading, crtQuery.isSuccess]);

  return (
    <UserWrapper>
      <ApiWrapper>
        <FilterProvider
          analytics={analytics}
          filters={filters}
        >
          <ChplChangeRequestsView
            analytics={analytics}
            scope={scope}
          />
        </FilterProvider>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplChangeRequests;

ChplChangeRequests.propTypes = {
  scope: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
