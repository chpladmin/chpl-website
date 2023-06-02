import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  func,
  string,
} from 'prop-types';
import {
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import ChplUserEdit from './user-edit';
import ChplUserInvite from './user-invite';
import ChplUserView from './user-view';

import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { user as userPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  header: {
    padding: '16px',
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
}));

function ChplUsers(props) {
  /* eslint-disable react/destructuring-assignment */
  const [users, setUsers] = useState([]);
  const [roles] = useState(props.roles);
  const [user, setUser] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setUsers(props.users.sort((a, b) => (a.fullName < b.fullName ? -1 : 1)));
  }, [props.users]); // eslint-disable-line react/destructuring-assignment

  const handleFilter = (event) => {
    const regex = new RegExp(event.target.value, 'i');
    setUsers(props.users
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
        props.dispatch('cancel');
        break;
      case 'delete':
        setUser(undefined);
        props.dispatch('delete', data);
        break;
      case 'edit':
        setUser(data);
        props.dispatch('edit', 'user');
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
                props.dispatch('impersonate');
              });
          });
        break;
      case 'invite':
        props.dispatch('invite', data);
        break;
      case 'save':
        networkService.updateUser(data)
          .then(() => {
            setUser(undefined);
            props.dispatch('refresh');
          }, (error) => {
            if (error.data.error) {
              setErrors([error.data.error]);
            } else if (error.data?.errorMessages?.length > 0) {
              setErrors(error.data.errorMessages);
            }
          });
        break;
        // no default
    }
  };

  return (
    <ThemeProvider theme={theme}>

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
              <>
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
              </>
            </div>
          )}
    </ThemeProvider>
  );
}

export default ChplUsers;

ChplUsers.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  roles: arrayOf(string).isRequired,
};
