import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf, bool, func, number, string,
} from 'prop-types';

import ChplUserInvite from './user-invite';
import ChplUserView from './user-view';
import ChplUserEdit from './user-edit';

import { usePutUser } from 'api/users';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { user as userPropType } from 'shared/prop-types';
import { theme } from 'themes';
import { UserContext, useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: 'calc(100vh - 188px)',
  },
  header: {
    padding: '16px',
    marginBottom: '16px',
    display: 'flex',
    gap: '8px',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '.5px solid #c2c6ca',
    borderRadius: '8px',
    boxShadow: 'rgb(149 157 165 / 10%) 0px 4px 8px',
    alignItems: 'stretch',
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },
  users: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(225px, 1fr))',
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    },
  },
  cardHeaderAction: {
    margin: '0',
  },
});

function ChplUsersView({
  dispatch, groupNames, users: initialUsers, organizationId, isLoading,
}) {
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const { mutate } = usePutUser();
  const [activeUser, setActiveUser] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleFilter = (event) => {
    const regex = new RegExp(event.target.value, 'i');
    if (event.target.value.length > 0) {
      eventTrack({
        ...analytics,
        event: 'Search User',
        label: event.target.value,
      });
    }
    setUsers(initialUsers
      .filter((u) => regex.test(u.fullName)
                     || regex.test(u.email)
              || regex.test(u.subjectName)));
  };

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'cancel':
        setActiveUser(undefined);
        handleFilter({ target: { value: '' } });
        eventTrack({
          ...analytics,
          event: 'Cancel User Edit',
        });
        dispatch('cancel');
        break;
      case 'delete':
        setActiveUser(undefined);
        eventTrack({
          ...analytics,
          event: 'Delete User',
        });
        dispatch('delete', data);
        break;
      case 'edit':
        setActiveUser(data);
        eventTrack({
          ...analytics,
          event: 'Edit User',
        });
        dispatch('edit', 'user');
        break;
      case 'invite':
        eventTrack({
          ...analytics,
          event: 'Send Invite',
        });
        dispatch('invite', data);
        break;
      case 'save':
        mutate(data, {
          onSuccess: () => {
            setActiveUser(undefined);
            eventTrack({
              ...analytics,
              event: 'Save User',
            });
            dispatch('refresh');
          },
          onError: (error) => {
            if (error.data.error) {
              setErrors([error.data.error]);
            } else if (error.data?.errorMessages?.length > 0) {
              setErrors(error.data.errorMessages);
            }
          },
        });
        break;
        // no default
    }
  };

  const displayUser = (userToDisplay) => (
    <ChplUserView
      key={userToDisplay.cognitoId}
      user={userToDisplay}
      dispatch={handleDispatch}
    />
  );

  const displayUserEdit = (userToEdit) => (
    <ChplUserEdit
      user={userToEdit}
      errors={errors}
      dispatch={handleDispatch}
      organizationId={organizationId}
    />
  );

  if (!hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-developer'])) {
    return null;
  }

  if (isLoading) { return <CircularProgress />; }

  return (
    <Container disableGutters maxWidth="lg">
      { activeUser
        && (
          displayUserEdit(activeUser)
        )}
      { !activeUser
        && (
          <div className={classes.container}>
            <Card>
              <CardHeader
                title="Manage Users"
                classes={{
                  action: classes.cardHeaderAction,
                }}
                action={(
                  <Typography className={classes.userCount}>
                    (
                    {users.length}
                    {' '}
                    user
                    {users.length === 1 ? '' : 's'}
                    )
                  </Typography>
                )}
              />
              <CardContent>
                <div className={classes.header}>
                  <ChplTextField
                    id="user-filter"
                    name="userFilter"
                    label="Search by Name or Email"
                    onChange={handleFilter}
                  />
                  <ChplUserInvite
                    groupNames={groupNames}
                    dispatch={handleDispatch}
                  />
                </div>
                <div className={classes.users}>
                  { users
                    .sort((a, b) => a.fullName.localeCompare(b.fullName, 'en', { sensitivity: 'base' }))
                    .map((u) => displayUser(u))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
    </Container>
  );
}

export default ChplUsersView;

ChplUsersView.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  groupNames: arrayOf(string).isRequired,
  organizationId: number,
  isLoading: bool,
};

ChplUsersView.defaultProps = {
  organizationId: undefined,
  isLoading: false,
};
