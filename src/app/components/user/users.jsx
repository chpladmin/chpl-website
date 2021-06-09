import React, { useState } from 'react';
import {
  arrayOf,
  func,
  string,
} from 'prop-types';
import {
  Container,
  Paper,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import { getAngularService } from '../../services/angular-react-helper';
import ChplUserEdit from './user-edit';
import ChplUserInvite from './user-invite';
import ChplUserView from './user-view';
import { ChplTextField } from '../util';
import theme from '../../themes/theme';
import {
  user as userPropType,
} from '../../shared/prop-types';

const useStyles = makeStyles(() => ({
  container: {
    display: 'grid',
    gap: '8px',
  },
  header: {
    padding: '16px',
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '4fr 64px',
  },
  users: {
    padding: '16px',
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    alignItems: 'start',
  },
}));

function ChplUsers(props) {
  /* eslint-disable react/destructuring-assignment */
  const [users, setUsers] = useState(props.users.sort((a, b) => (a.fullName < b.fullName ? -1 : 1)));
  const [roles] = useState(props.roles);
  const [user, setUser] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

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
        break;
      case 'delete':
        setUser(undefined);
        props.dispatch('delete', data);
        break;
      case 'edit':
        setUser(data);
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
      <Container maxWidth={false}>
        <Paper className={classes.container}>
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
            <>
              <div className={classes.header}>
                <ChplTextField
                  id="user-filter"
                  name="userFilter"
                  label="Full Name, Friendly Name, Title, Email, or User Name"
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
            )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}

export default ChplUsers;

ChplUsers.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  roles: arrayOf(string).isRequired,
};
