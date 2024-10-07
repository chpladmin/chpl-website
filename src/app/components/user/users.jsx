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

import ChplUsersView from './users-view';
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
import { AnalyticsContext, FlagContext, UserContext, useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
});

function ChplUsers({
  dispatch, roles, groupNames, users,
}) {
  const { analytics } = useAnalyticsContext();

  const data = {
    analytics: {
      ...analytics,
      category: 'User Management',
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      <ChplUsersView
        users={users}
        dispatch={dispatch}
        roles={roles}
        groupNames={groupNames}
      />
    </AnalyticsContext.Provider>
  );
}

export default ChplUsers;

ChplUsers.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  roles: arrayOf(string).isRequired,
  groupNames: arrayOf(string).isRequired,
};
