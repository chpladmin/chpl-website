import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from '@material-ui/core';
import PeopleOutlinedIcon from '@material-ui/icons/PeopleOutlined';

import ChplTargetedUsersView from './targeted-users-view';

import { useFetchCertificationStatuses } from 'api/data';
import { useFetchTargetedUsersUsage } from 'api/standards';

function ChplTargetedUsers() {
  const { data, isLoading, isSuccess } = useFetchTargetedUsersUsage();
  const statusesQuery = useFetchCertificationStatuses();
  const [certificationStatuses, setCertificationStatuses] = useState([]);
  const [targetedUsers, setTargetedUsers] = useState([]);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setTargetedUsers(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    if (statusesQuery.isLoading || !statusesQuery.isSuccess) { return; }
    setCertificationStatuses(statusesQuery.data);
  }, [statusesQuery.data, statusesQuery.isLoading, statusesQuery.isSuccess]);

  if (isLoading || statusesQuery.isLoading) {
    return (
      <CircularProgress />
    );
  }

  return (
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
          targetedUsers={targetedUsers}
        />
      </CardContent>
    </Card>
  );
}

export default ChplTargetedUsers;
