import React from 'react';
import { object } from 'prop-types';

import ChplChangeRequestsView from './change-requests-view';

import { UserWrapper } from 'components/login';
import ApiWrapper from 'api/api-wrapper';
import { FilterProvider } from 'components/filter';

function ChplChangeRequests(props) {
  const { scope } = props;
  const analytics = {
    category: 'Change Requests',
  };
  const filters = [{
    key: 'derivedCertificationEditions',
    display: 'Certification Edition',
    required: true,
    values: [
      { value: '2015', default: true },
      { value: '2015 Cures Update', default: true },
    ],
  }, {
    key: 'certificationStatuses',
    display: 'Certification Status',
    values: [
      { value: 'Active', default: true },
      { value: 'Suspended by ONC', default: true },
      { value: 'Suspended by ONC-ACB', default: true },
      { value: 'Terminated by ONC' },
      { value: 'Withdrawn by Developer Under Surveillance/Review' },
      { value: 'Withdrawn by ONC-ACB' },
      { value: 'Withdrawn by Developer' },
      { value: 'Retired' },
    ],
  }];

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
