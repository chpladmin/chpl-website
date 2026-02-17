import React from 'react';
import {
  arrayOf, bool, func, number, string,
} from 'prop-types';

import ChplUsers from './users';

import AppWrapper from 'app-wrapper';
import { user as userPropType } from 'shared/prop-types';

function ChplUsersWrapper({
  users,
  dispatch,
  groupNames,
  organizationId = null,
  isLoading = false,
}) {
  return (
    <AppWrapper>
      <ChplUsers
        users={users}
        dispatch={dispatch}
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
  groupNames: arrayOf(string).isRequired,
  organizationId: number,
  isLoading: bool,
};
