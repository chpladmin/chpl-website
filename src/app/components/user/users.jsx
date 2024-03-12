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

import { usePutUser } from 'api/users';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { user as userPropType } from 'shared/prop-types';
import { theme } from 'themes';
import { FlagContext } from 'shared/contexts';

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

function ChplUsers({ dispatch, roles, users: initialUsers }) {
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const { mutate } = usePutUser();7
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const classes = useStyles();
  const { isOn } = useContext(FlagContext);
  const [ssoIsOn, setSsoIsOn] = useState(false);

  useEffect(() => {
    setUsers(initialUsers.sort((a, b) => (a.fullName < b.fullName ? -1 : 1)));
  }, [initialUsers]);

  useEffect(() => {
    setSsoIsOn(isOn('sso'));
  }, [isOn]);

  const handleFilter = (event) => {
    const regex = new RegExp(event.target.value, 'i');
    setUsers(initialUsers
      .filter((u) => regex.test(u.fullName)
                     || regex.test(u.friendlyName)
                     || regex.test(u.title)
                     || regex.test(u.email)
                     || regex.test(u.subjectName))
      .sort((a, b) => (a.fullName < b.fullName ? -1 : 1)));
  };

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'cancel':
        setUser(undefined);
        handleFilter({ target: { value: '' } });
        dispatch('cancel');
        break;
      case 'delete':
        setUser(undefined);
        dispatch('delete', data);
        break;
      case 'edit':
        setUser(data);
        dispatch('edit', 'user');
        break;
      case 'impersonate':
        networkService.impersonateUser(data)
          .then((token) => {
            $analytics.eventTrack('Impersonate User', { category: 'Authentication' });
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
        dispatch('invite', data);
        break;
      case 'cognito-invite':
        dispatch('cognito-invite', data);
        break;
      case 'save':
        mutate(data, {
          onSuccess: () => {
            setUser(undefined);
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

  return (
    <Box>
      { user
        && (
          <ChplUserEdit
            user={user}
            errors={errors}
            dispatch={handleDispatch}
          />
        )}
      { !user
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
                    label="Search by Name, Title, or Email"
                    onChange={handleFilter}
                  />
                  <ChplUserInvite
                    roles={roles}
                    dispatch={handleDispatch}
                  />
                  { (ssoIsOn) 
                    && (
                      <ChplCognitoUserInvite
                        dispatch={handleDispatch}
                      />
                    )}
                </div>
                <div className={classes.users}>
                  { users.map((u) => (
                    <ChplUserView
                      key={u.userId}
                      user={u}
                      dispatch={handleDispatch}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
    </Box>
  );
}

export default ChplUsers;

ChplUsers.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  roles: arrayOf(string).isRequired,
};
