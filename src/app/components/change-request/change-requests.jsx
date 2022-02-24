import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
} from '@material-ui/core';
import {
  arrayOf, func, object, string,
} from 'prop-types';
import Moment from 'react-moment';

import ChplChangeRequestsView from './change-requests-view';

import {
  useFetchChangeRequestTypes,
} from 'api/change-requests';
import { FilterProvider, defaultFilter } from 'components/filter';
import { FlagContext } from 'shared/contexts';

const analytics = {
  category: 'Change Requests',
};

const getDateEntry = ({ filter, value, handleTertiaryValueToggle }) => (
  <Button
    key={value.value}
    onClick={() => handleTertiaryValueToggle(value)}
  >
    {filter.getValueDisplay(value)}
  </Button>
);

const staticFilters = [{
  ...defaultFilter,
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
  getValueDisplay: (value) => (
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
  getValueEntry: getDateEntry,
}, {
  ...defaultFilter,
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
  getValueDisplay: (value) => (
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
  getValueEntry: getDateEntry,
}];

function ChplChangeRequests(props) {
  const { disallowedFilters, preFilter, scope } = props;
  const { demographicChangeRequestIsOn } = useContext(FlagContext);
  const [filters, setFilters] = useState(staticFilters);
  const crtQuery = useFetchChangeRequestTypes();

  useEffect(() => {
    const values = demographicChangeRequestIsOn ? [
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
      .filter((filter) => filter.key !== 'currentStatusName')
      .concat({
        ...defaultFilter,
        key: 'currentStatusName',
        display: 'Change Request Status',
        values,
        meets: (item, vs) => {
          const canMeet = vs
            .filter((value) => value.selected)
            .map((value) => value.value);
          return canMeet.length === 0 || canMeet.includes(item.currentStatusName);
        },
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
        scope={scope}
      />
    </FilterProvider>
  );
}

export default ChplChangeRequests;

ChplChangeRequests.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  preFilter: func.isRequired,
  scope: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
