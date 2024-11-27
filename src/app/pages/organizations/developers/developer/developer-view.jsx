import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';

import { useFetchUsersAtDeveloper } from 'api/developer';
import ChplAttestationsView from 'components/attestation/attestations-view';
import ChplChangeRequests from 'components/change-request/change-requests';
import ChplDeveloperViewDetails from 'components/developer/developer-view';
import ChplDirectReviews from 'components/direct-reviews/direct-reviews';
import ChplProducts from 'components/products/products';
import ChplRealWorldTestingView from 'components/real-world-testing/real-world-testing-view';
import ChplUsers from 'components/user/users';
import { DeveloperContext, FlagContext, UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
  },
});

const isActive = (statuses) => statuses.length === 0 || statuses.every((status) => status.endDay);

function ChplDeveloperView({ dispatch }) {
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const { demographicChangeRequestIsOn } = useContext(FlagContext);
  const { developer } = useContext(DeveloperContext);
  const usersQuery = useFetchUsersAtDeveloper(developer, hasAnyRole(['chpl-admin', 'chpl-onc']));
  const [state, setState] = useState('view');
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (usersQuery.isLoading || !usersQuery.isSuccess) { return; }
    setUsers(usersQuery.data.users);
  }, [usersQuery.data, usersQuery.isLoading, usersQuery.isSuccess]);

  const can = (action) => {
    if (hasAuthorityOn(developer)) { return false; } // basic authentication
    if (action === 'manageTracking') { return hasAnyRole(['chpl-developer']); } // only DEVELOPER can manage tracking
    if (action === 'split-developer' && developer.products.length < 2) { return false; } // cannot split developer without at least two products
    if (hasAnyRole(['chpl-admin', 'chpl-onc'])) { return true; } // can do everything
    if (action === 'join') { return false; } // if not above roles, can't join
    if (action === 'split-developer') { return isActive(developer.statuses) && hasAnyRole(['chpl-onc-acb']); } // ACB can split
    if (action === 'edit') {
      if (demographicChangeRequestIsOn) {
        return isActive(developer.statuses) && hasAnyRole(['chpl-onc-acb', 'chpl-developer']); // Developer can only edit based on flag
      }
      return isActive(developer.statuses) && hasAnyRole(['chpl-onc-acb']); // ACB can only edit Active
    }
    if (action === 'manageUsers') { return isActive(developer.statuses) && hasAnyRole(['chpl-onc-acb', 'chpl-developer']); }
    console.error(`Unknown action: ${action}`);
    //return isActive(developer.statuses) && hasAnyRole(['chpl-onc-acb']); // must be active
  };

  const handleUserDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
      case 'refresh':
        setState('view');
        break;
      case 'edit':
        setState('editUser');
        break;
      case 'delete':
        setState('view');
        dispatch(action, payload);
        break;
      default:
        dispatch(action, payload);
    }
  };

  return (
    <Box className={classes.mainContent}>
      <Box className={state === 'editUser' ? classes.fullWidthGridRow : ''}>
        { state === 'view'
          && (
            <>
              <ChplDeveloperViewDetails
                developer={developer}
                dispatch={dispatch}
                canEdit={() => can('edit')}
                canJoin={() => can('join')}
                canSplit={() => can('split-developer')}
                isSplitting={false}
              />
              <ChplRealWorldTestingView
                developer={developer}
              />
              <ChplAttestationsView
                developer={developer}
                dispatch={dispatch}
              />
            </>
          )}
        { (state === 'view' || state === 'editUser')
          && (
            <ChplUsers
              users={users}
              dispatch={handleUserDispatch}
              roles={['ROLE_DEVELOPER']}
              groupNames={['chpl-developer']}
            />
          )}
      </Box>
      { state === 'view'
        && (
          <Box>
            { can('manageTracking')
              && (
                <ChplChangeRequests
                  disallowedFilters={['submittedDateTime', 'searchTerm']}
                  bonusQuery={`&developerId=${developer.id}`}
                />
              )}
            <ChplDirectReviews
              developer={developer}
            />
            <ChplProducts
              developer={developer}
            />
          </Box>
        )}
    </Box>
  );
}

export default ChplDeveloperView;

ChplDeveloperView.propTypes = {
  dispatch: func.isRequired,
};
