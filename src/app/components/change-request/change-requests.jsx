import React, { useEffect, useState } from 'react';
import {
  arrayOf, func, string,
} from 'prop-types';
import Moment from 'react-moment';

import ChplChangeRequestsView from './change-requests-view';

import {
  useFetchChangeRequestTypes,
} from 'api/change-requests';
import { FilterProvider } from 'components/filter';

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
      .reduce((can, value) => can && (value.value === 'Before' ? item.currentStatusChangeDate < (new Date(value.data.date)).getTime() : (new Date(value.data.date)).getTime() < item.currentStatusChangeDate), true);
    return canMeet;
  },
  getDisplay: (value) => (
    <>
      {value.value}
      { value.data.date && (
      <>
        {': '}
        <Moment fromNow>{value.data.date}</Moment>
      </>
      )}
    </>
  ),
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
      .reduce((can, value) => can && (value.value === 'Before' ? item.submittedDate < (new Date(value.data.date)).getTime() : (new Date(value.data.date)).getTime() < item.submittedDate), true);
    return canMeet;
  },
  getDisplay: (value) => (
    <>
      {value.value}
      { value.data.date && (
      <>
        {': '}
        <Moment fromNow>{value.data.date}</Moment>
      </>
      )}
    </>
  ),
}];

function ChplChangeRequests(props) {
  const { disallowedFilters, preFilter } = props;
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
    <FilterProvider
      analytics={analytics}
      filters={filters}
    >
      <ChplChangeRequestsView
        analytics={analytics}
        disallowedFilters={disallowedFilters}
        preFilter={preFilter}
      />
    </FilterProvider>
  );
}

export default ChplChangeRequests;

ChplChangeRequests.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  preFilter: func.isRequired,
};
