import React from 'react';
import { arrayOf, func, string } from 'prop-types';

import ChplUsers from './users';

import AppWrapper from 'app-wrapper';
import { user as userPropType } from 'shared/prop-types';

function ChplUsersWrapper({ users, dispatch, roles, groupNames }) {
  return (
    <AppWrapper>
      <ChplUsers users={users} dispatch={dispatch} roles={roles} groupNames={groupNames} />
    </AppWrapper>
  );
}

export default ChplUsersWrapper;

ChplUsersWrapper.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  roles: arrayOf(string).isRequired,
  groupNames: arrayOf(string).isRequired,
};
