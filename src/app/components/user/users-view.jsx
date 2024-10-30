import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, string } from 'prop-types';

import ChplUserEdit from './user-edit';
import ChplUserInvite from './user-invite';
import ChplCognitoUserInvite from './cognito-user-invite';
import ChplUserView from './user-view';
import ChplCognitoUserView from './cognito-user-view';
import ChplCognitoUserEdit from './cognito-user-edit';

import {
  usePutUser,
  usePutCognitoUser,
} from 'api/users';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { user as userPropType } from 'shared/prop-types';
import { theme } from 'themes';
import { FlagContext, UserContext, useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
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
  dispatch, roles, groupNames, users: initialUsers,
}) {
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const { analytics } = useAnalyticsContext();
  const { ssoIsOn } = useContext(FlagContext);
  const { hasAnyRole, user } = useContext(UserContext);
  const { mutate } = usePutUser();
  const cognitoMutate = usePutCognitoUser().mutate;
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
      case 'impersonate':
        networkService.impersonateUser(data)
          .then((token) => {
            eventTrack({
              ...analytics,
              event: 'Impersonate User',
            });
            authService.saveToken(token.token);
            networkService.getUserById(authService.getUserId())
              .then((u) => {
                authService.saveCurrentUser(u);
                $rootScope.$broadcast('impersonating');
                dispatch('impersonate');
              });
          });
        break;
      case 'invite':
        eventTrack({
          ...analytics,
          event: 'Send Invite',
        });
        dispatch('invite', data);
        break;
      case 'cognito-invite':
        eventTrack({
          ...analytics,
          event: 'Send Invite',
        });
        dispatch('cognito-invite', data);
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
      case 'cognito-save':
        cognitoMutate(data, {
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

  const displayUser = (userToDisplay) => {
    if (ssoIsOn) {
      return (
        <ChplCognitoUserView
          key={userToDisplay.cognitoId}
          user={userToDisplay}
          dispatch={handleDispatch}
        />
      );
    }
    return (
      <ChplUserView
        key={userToDisplay.userId}
        user={userToDisplay}
        dispatch={handleDispatch}
      />
    );
  };

  const displayUserEdit = (userToEdit) => {
    if (ssoIsOn) {
      return (
        <ChplCognitoUserEdit
          user={userToEdit}
          errors={errors}
          dispatch={handleDispatch}
        />
      );
    }
    return (
      <ChplUserEdit
        user={userToEdit}
        errors={errors}
        dispatch={handleDispatch}
      />
    );
  };

  if (!hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-developer'])) {
    return null;
  }

  return (
    <Box>
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
                  { !ssoIsOn
                    && (
                      <ChplUserInvite
                        roles={roles}
                        dispatch={handleDispatch}
                      />
                    )}
                  { ssoIsOn
                    && (
                      <ChplCognitoUserInvite
                        groupNames={groupNames}
                        dispatch={handleDispatch}
                      />
                    )}
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
    </Box>
  );
}

export default ChplUsersView;

ChplUsersView.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  roles: arrayOf(string).isRequired,
  groupNames: arrayOf(string).isRequired,
};
