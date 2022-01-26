import React, { useEffect, useState } from 'react';
import { object } from 'prop-types';
import Moment from 'react-moment';

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

const staticFilters = [{
  key: 'currentStatusName',
  display: 'Change Request Status',
  values: [
    { value: 'Accepted' },
    { value: 'Cancelled by Requester' },
    { value: 'Pending Developer Action', default: true },
    { value: 'Pending ONC-ACB Action', default: true },
    { value: 'Rejected' },
  ],
  meets: (item, values) => {
    const canMeet = values
      .filter((value) => value.selected)
      .map((value) => value.value);
    return canMeet.length === 0 || canMeet.includes(item.currentStatusName);
  },
}, {
  key: 'currentStatusChangeDate',
  display: 'Last Updated',
  values: [
    { value: 'Before', data: { date: '' } },
    { value: 'After', data: { date: '' } },
  ],
  meets: (item, values) => {
    const canMeet = values
      .filter((value) => value.selected && value.data.date)
      .reduce((can, value) => {
        return can && (value.value === 'Before' ? item.currentStatusChangeDate < (new Date(value.data.date)).getTime() : (new Date(value.data.date)).getTime() < item.currentStatusChangeDate);
      }, true);
    return canMeet;
  },
  getDisplay: (value) => {
    return (
      <>
        {value.value}
        { value.data.date && (
          <>
            {': '}
            <Moment fromNow>{value.data.date}</Moment>
          </>
        )}
      </>
    );
  },
}, {
  key: 'submittedDate',
  display: 'Creation Date',
  values: [
    { value: 'Before', data: { date: '' } },
    { value: 'After', data: { date: '' } },
  ],
  meets: (item, values) => {
    const canMeet = values
      .filter((value) => value.selected && value.data.date)
      .reduce((can, value) => {
        return can && (value.value === 'Before' ? item.submittedDate < (new Date(value.data.date)).getTime() : (new Date(value.data.date)).getTime() < item.submittedDate);
      }, true);
    return canMeet;
  },
  getDisplay: (value) => {
    return (
      <>
        {value.value}
        { value.data.date && (
          <>
            {': '}
            <Moment fromNow>{value.data.date}</Moment>
          </>
        )}
      </>
    );
  },
}];

function ChplChangeRequests(props) {
  const { scope } = props;
  const [filters, setFilters] = useState(staticFilters);
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
      .filter((filter) => filter.key !== 'changeRequestTypeName')
      .concat({
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
