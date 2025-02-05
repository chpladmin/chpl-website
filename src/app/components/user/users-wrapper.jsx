import React from 'react';
import {
  arrayOf, bool, func, number, string,
} from 'prop-types';

import ChplUsers from './users';

import AppWrapper from 'app-wrapper';
import { user as userPropType } from 'shared/prop-types';

function ChplUsersWrapper({
  users, dispatch, roles, groupNames, organizationId, isLoading,
}) {
  return (
    <AppWrapper>
      <ChplUsers
        users={users}
        dispatch={dispatch}
        roles={roles}
        groupNames={groupNames}
        organizationId={organizationId}
        isLoading={isLoading}
      />
    </AppWrapper>
  );
}

export default ChplUsersWrapper;

ChplUsersWrapper.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  roles: arrayOf(string).isRequired,
  groupNames: arrayOf(string).isRequired,
  organizationId: number,
  isLoading: bool,
};

ChplUsersWrapper.defaultProps = {
  organizationId: null,
  isLoading: false,
};
