import React, { useContext } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  makeStyles,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { func } from 'prop-types';
import ReactGA from 'react-ga4';

import { usePostCognitoLogout } from 'api/auth';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '16px',
  },
  loginHeader: {
    backgroundColor: '#ffffff',
    padding: '16px 0px 0px 16px',
  },
});

function ChplLoggedIn({ dispatch }) {
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const authService = getAngularService('authService');
  const { user, setUser } = useContext(UserContext);
  const postLogout = usePostCognitoLogout();
  const classes = useStyles();

  const logout = (e) => {
    e.stopPropagation();
    if (user?.email) {
      postLogout.mutate({
        email: user.email,
      });
    }
    setUser({});
    dispatch({ action: 'loggedOut' });
    authService.logout();
    ReactGA.event({ action: 'Log Out', category: 'Authentication' });
    Idle.unwatch();
    $rootScope.$broadcast('loggedOut');
  };

  return (
    <Card>
      <CardHeader className={classes.loginHeader} title={user?.fullName ?? 'Logged in'} />
      <CardContent className={classes.grid}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={logout}
          endIcon={<ExitToAppIcon />}
        >
          Log Out
        </Button>
        <Button
          fullWidth
          color="secondary"
          variant="contained"
          onClick={(e) => { dispatch({ action: 'changePassword' }); e.stopPropagation(); }}
          endIcon={<CreateIcon />}
        >
          Change Password
        </Button>
      </CardContent>
    </Card>
  );
}

export default ChplLoggedIn;

ChplLoggedIn.propTypes = {
  dispatch: func.isRequired,
};
