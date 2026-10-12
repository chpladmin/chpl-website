import React from 'react';
import {
  arrayOf, bool, func, number, string,
} from 'prop-types';

import ChplUsers from './users';

import { user as userPropType } from 'shared/prop-types';

function ChplUsersWrapper({
  users,
  dispatch,
  groupNames,
  organizationId = null,
  isLoading = false,
}) {
  return (
    <>
      <ChplUsers
        users={users}
        dispatch={dispatch}
        groupNames={groupNames}
        organizationId={organizationId}
        isLoading={isLoading}
      />
    </>
  );
}

export default ChplUsersWrapper;

ChplUsersWrapper.propTypes = {
  users: arrayOf(userPropType).isRequired,
  dispatch: func.isRequired,
  groupNames: arrayOf(string).isRequired,
  organizationId: number,
  isLoading: bool,
};
