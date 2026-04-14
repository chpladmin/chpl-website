import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';

import { useFetchUsersAtDeveloper } from 'api/developer';
import ChplAttestationsView from 'components/attestation/attestations-view';
import ChplChangeRequests from 'components/change-request/change-requests-wrapper'; // figure out how to not need breadcrumbs
import ChplDeveloperViewDetails from 'components/developer/developer-view';
import ChplDirectReviews from 'components/direct-reviews/direct-reviews';
import ChplInsightsView from 'components/insights/insights-view';
import ChplProducts from 'components/products/products';
import ChplRealWorldTestingView from 'components/real-world-testing/real-world-testing-view';
import ChplSbulsView from 'components/sbul/sbuls-view';
import ChplUsers from 'components/user/users';
import { DeveloperContext, FlagContext, UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  focus: {
    display: 'flex',
    flexDirection: 'column-reverse',
    paddingTop: '16px',
  },
  lefthandContainer: {
    width: '33%',
    minWidth: '33%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
      minWidth: '100%',
    },
  },
  lefthandColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: '16px',
    gap: '32px',
    minHeight: 'calc(100vh - 290px)',
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  righthandColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    width: '100%',
  },
});

const isActive = (statuses) => statuses.length === 0 || statuses.every((status) => status.endDay);

function ChplDeveloperView({ dispatch }) {
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const { demographicChangeRequestIsOn, insightsDisplayIsOn } = useContext(FlagContext);
  const { developer } = useContext(DeveloperContext);
  const usersQuery = useFetchUsersAtDeveloper({
    developer,
    enabled: hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) || (hasAnyRole(['chpl-developer']) && hasAuthorityOn(developer)),
  });
  const [state, setState] = useState('view');
  const [users, setUsers] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    if (usersQuery.isLoading || !usersQuery.isSuccess) { return; }
    setUsers(usersQuery.data.users);
  }, [usersQuery.data, usersQuery.isLoading, usersQuery.isSuccess]);

  const can = (action) => {
    if (!hasAuthorityOn(developer)) { return false; } // basic authentication
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
    console.error(`Unknown "can" action: ${action}`);
    return false;
  };

  const handleProductDispatch = ({ action, payload }) => {
    switch (action) {
      case 'edit':
      case 'split':
      case 'merge':
        dispatch(`${action}Product`, payload);
        break;
      default:
        dispatch(action, payload);
    }
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
    <Box className={`${state === 'view' ? classes.mainContent : classes.focus}`}>
      <Box className={classes.lefthandContainer}>
        { state === 'view'
          && (
            <Box className={classes.lefthandColumn}>
              <ChplDeveloperViewDetails
                developer={developer}
                dispatch={dispatch}
                canEdit={() => can('edit')}
                canJoin={() => can('join')}
                canSplit={() => can('split-developer')}
                isSplitting={false}
              />
              <ChplAttestationsView
                developer={developer}
                dispatch={dispatch}
              />
              <ChplRealWorldTestingView
                developer={developer}
              />
              { insightsDisplayIsOn
                && (
                  <ChplInsightsView
                    developer={developer}
                  />
                )}
              <ChplSbulsView
                developer={developer}
                dispatch={dispatch}
              />
            </Box>
          )}
      </Box>
      <Box className={classes.righthandColumn}>
        {state === 'view' && (
          <>
            {can('manageTracking') && (
              <ChplChangeRequests
                disallowedFilters={['submittedDateTime', 'searchTerm']}
                bonusQuery={`&developerId=${developer.id}`}
                dispatch={dispatch}
                useFooterSpacing={false}
              />
            )}
            <ChplDirectReviews developer={developer} />
          </>
        )}
        {state === 'view' && (
          <ChplProducts developer={developer} dispatch={handleProductDispatch} />
        )}
        {(state === 'view' || state === 'editUser') && (
          <ChplUsers
            users={users}
            dispatch={handleUserDispatch}
            groupNames={['chpl-developer']}
            organizationId={developer.id}
            isLoading={usersQuery.isLoading}
          />
        )}
      </Box>
    </Box>
  );
}

export default ChplDeveloperView;

ChplDeveloperView.propTypes = {
  dispatch: func.isRequired,
};
