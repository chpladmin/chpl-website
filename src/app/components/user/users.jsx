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
import { ChplUserEdit, ChplUserInvite, ChplUserView } from '.';
import theme from '../../themes/theme';
import {
  user as userPropType,
} from '../../shared/prop-types';

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
  },
  filter: {
    flex: 5,
  },
  users: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
  },
}));

function ChplUsers(props) {
  /* eslint-disable react/destructuring-assignment */
  const [users, setUsers] = useState(props.users.sort((a, b) => (a.fullName < b.fullName ? -1 : 1)));
  const [roles] = useState(props.roles);
  const [user, setUser] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const networkService = getAngularService('networkService');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'edit':
        setUser(data);
        break;
      case 'cancel':
        setUser(undefined);
        break;
      default:
        console.log({action, data});
        // props.dispatch(something);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false}>
        <Paper>
          { user &&
            <ChplUserEdit
              user={user}
              errors={errors}
              dispatch={handleDispatch} />
          }
          { !user &&
            <>
              <div className={classes.header}>
                <div className={classes.filter}>Search</div>
                <ChplUserInvite
                  roles={roles}
                  dispatch={handleDispatch} />
              </div>
              <div className={classes.users}>
                { filteredUsers.map((user) =>
                            <ChplUserView
                              key={user.userId}
                              user={user}
                              dispatch={handleDispatch}/>
                           )}
              </div>
            </>
          }
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
