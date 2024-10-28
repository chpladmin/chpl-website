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

import { usePostCognitoLogout } from 'api/auth';
import { getAngularService } from 'services/angular-react-helper';
import { eventTrack } from 'services/analytics.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';

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
  const { analytics } = useAnalyticsContext();
  const postLogout = usePostCognitoLogout();
  const classes = useStyles();

  const changePassword = (e) => {
    e.stopPropagation();
    eventTrack({
      ...analytics,
      event: 'Change Password',
      category: 'Authentication',
    });
    dispatch({ action: 'changePassword' });
  };

  const logout = (e) => {
    e.stopPropagation();
    eventTrack({
      ...analytics,
      event: 'Log Out',
      category: 'Authentication',
    });
    if (user?.email) {
      postLogout.mutate({
        email: user.email,
      });
    }
    setUser({});
    dispatch({ action: 'loggedOut' });
    authService.logout();
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
          onClick={changePassword}
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
