import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@mui/material';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';

import ChplTargetedUsersView from './targeted-users-view';

import { useFetchCertificationStatuses } from 'api/data';
import {
  FilterProvider,
  defaultFilter,
  getDateDisplay,
  getDateEntry,
} from 'components/filter';
import { getRadioValueEntry } from 'components/filter/filters/value-entries';

// Searched on the server, so each filter only has to build its query parameters
const filters = [{
  ...defaultFilter,
  key: 'creationDate',
  display: 'Creation Date',
  values: [
    { value: 'Before', default: '' },
    { value: 'After', default: '' },
  ],
  getQuery: (value) => value.values
    .sort((a, b) => (a.value < b.value ? -1 : 1))
    .map((v) => `${v.value === 'After' ? 'creationDateStart' : 'creationDateEnd'}=${v.selected}`)
    .join('&'),
  getValueDisplay: getDateDisplay,
  getValueEntry: getDateEntry,
}, {
  ...defaultFilter,
  key: 'isUsed',
  display: 'Used',
  getValueEntry: getRadioValueEntry,
  singular: true,
  values: [
    { value: 'true', display: 'Yes' },
    { value: 'false', display: 'No' },
  ],
}];

function ChplTargetedUsers() {
  const { data, isLoading, isSuccess } = useFetchCertificationStatuses();
  const [certificationStatuses, setCertificationStatuses] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setCertificationStatuses(data);
  }, [data, isLoading, isSuccess]);

  if (isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
    <FilterProvider
      filters={filters}
      storageKey="storageKey-targetedUsers"
    >
      <Card>
        <CardHeader
          style={{ paddingLeft: '16px' }}
          title={(
            <>
              Targeted Users
              <PeopleOutlinedIcon style={{ verticalAlign: 'middle', marginLeft: '8px' }} />
            </>
          )}
        />
        <CardContent>
          <ChplTargetedUsersView
            certificationStatuses={certificationStatuses}
          />
        </CardContent>
      </Card>
    </FilterProvider>
  );
}

export default ChplTargetedUsers;

export { filters };
