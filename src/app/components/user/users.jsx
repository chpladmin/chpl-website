import React from 'react';
import { arrayOf, func, string } from 'prop-types';

import ChplUsersView from './users-view';

import { user as userPropType } from 'shared/prop-types';
import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';

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
