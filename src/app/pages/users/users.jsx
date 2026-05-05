import React, { useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { useFetchUsers, usePostCreateInvitation } from 'api/users';
import ChplUsers from 'components/user/users';
import { UserContext } from 'shared/contexts';

function ChplUsersPage() {
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isSuccess } = useFetchUsers();
  const { mutate: invite } = usePostCreateInvitation();
  const [users, setUsers] = useState([]);
  const [groupNames, setGroupNames] = useState([]);

  useEffect(() => {
    if (hasAnyRole(['chpl-admin'])) {
      setGroupNames(['chpl-admin', 'chpl-onc', 'chpl-cms-staff']);
    } else {
      setGroupNames(['chpl-onc', 'chpl-cms-staff']);
    }
  }, [hasAnyRole]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setUsers(data.users
      .filter((user) => !['chpl-onc-acb', 'chpl-developer'].includes(user.role)));
  }, [data, isLoading, isSuccess]);

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
      case 'edit':
      case 'refresh':
        // no-op
        break;
      case 'invite':
        invite({ groupName: payload.groupName, email: payload.email }, {
          onSuccess: () => {
            enqueueSnackbar(`Email sent successfully to ${payload.email}`, {
              variant: 'success',
            });
          },
          onError: () => {
            enqueueSnackbar('Email was not sent', {
              variant: 'error',
            });
          },
        });
        break;
      default:
        console.error('no action found', action, payload);
    }
  };

  if (isLoading || !isSuccess) {
    return <CircularProgress />;
  }

  return (
    <>
      <Typography>
        CHPL Users - test
      </Typography>
      <ChplUsers
        dispatch={handleDispatch}
        users={users}
        groupNames={groupNames}
      />
    </>
  );
}

export default ChplUsersPage;

ChplUsersPage.propTypes = { };
