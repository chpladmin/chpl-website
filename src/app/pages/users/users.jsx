import React, { useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { useFetchUsers } from 'api/users';
import ChplUsers from 'components/user/users';
import {
  AnalyticsContext,
  UserContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    padding: '32px 0',
    backgroundColor: palette.background,
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      alignItems: 'start',
    },
  },
  favoriteContainer: {
    display: 'flex',
    alignItems: 'baseline',
  },
  loadingScreen: {
    height: '100vh',
  },
  pageHeader: {
    padding: '32px 0',
    backgroundColor: palette.white,
  },
});

function ChplUsersPage() {
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const { data, isLoading, isSuccess } = useFetchUsers();
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState([]);
  const [groupNames, setGroupNames] = useState([]);
  const classes = useStyles();

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
      default:
        enqueueSnackbar('Standard Deleted', {
          variant: 'error',
        });
        console.error('no action found', action, payload);
    }
  };

  const analyticsData = {
    analytics: {
      ...analytics,
      category: 'User Management',
    },
  };

  if (isLoading || !isSuccess) {
    return (
      <div className={classes.loadingScreen}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <ChplUsers
        users={users}
        groupNames={groupNames}
        dispatch={handleDispatch}
      />
    </AnalyticsContext.Provider>
  );
}

export default ChplUsersPage;

ChplUsersPage.propTypes = { };
