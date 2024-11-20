import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { number, oneOfType, string } from 'prop-types';

import ChplDeveloperEdit from './edit';

import { useFetchDeveloperHierarchy } from 'api/developer';
import ChplAttestationsView from 'components/attestation/attestations-view';
import ChplChangeRequests from 'components/change-request/change-requests';
import ChplDeveloper from 'components/developer/developer-view';
import ChplDirectReviews from 'components/direct-reviews/direct-reviews';
import ChplProducts from 'components/products/products';
import ChplRealWorldTestingView from 'components/real-world-testing/real-world-testing-view';
import ChplUsers from 'components/user/users';
import { getAngularService } from 'services/angular-react-helper';
import { eventTrack } from 'services/analytics.service';
import {
  AnalyticsContext,
  DeveloperContext,
  FlagContext,
  UserContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

const isActive = (statuses) => statuses.length === 0 || statuses.every((status) => status.endDay);

function ChplDeveloperPage({ id }) {
  const $state = getAngularService('$state');
  const { analytics } = useAnalyticsContext();
  const { canManageDeveloper, hasAnyRole, user } = useContext(UserContext);
  const { demographicChangeRequestIsOn } = useContext(FlagContext);
  const { data, isLoading, isSuccess } = useFetchDeveloperHierarchy({ id });
  const [developer, setDeveloper] = useState(undefined);
  const [state, setState] = useState('view');
  const classes = useStyles();
  let analyticsData;

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setDeveloper(data);
  }, [data, isLoading, isSuccess]);

  const can = (action) => {
    if (canManageDeveloper(developer)) { return false; } // basic authentication
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

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        setState('view');
        break;
      case 'edit':
        setState('edit');
        break;
      case 'split':
      case 'join':
        $state.go(`organizations.developers.developer.${action}`);
        break;
      default:
        console.error(`Unknown action: ${action}`);
    }
  };

  if (isLoading || !isSuccess || !developer) {
    return <CircularProgress />;
  }

  const developerState = {
    developer,
  };

  analyticsData = {
    analytics: {
      ...analytics,
      category: 'Developer',
      label: developer.name,
    },
  };

  return (
    <AnalyticsContext.Provider value={analyticsData}>
      <DeveloperContext.Provider value={developerState}>
        <Container maxWidth="lg">
          <Typography
            variant="h1"
          >
            { developer.name }
          </Typography>
        </Container>
        { state === 'view'
          && (
            <Container maxWidth="lg" id="main-content" tabIndex="-1">
              <ChplDeveloper
                developer={developer}
                dispatch={handleDispatch}
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
                dispatch={handleDispatch}
              />
              <ChplUsers
                users={[]}
                dispatch={handleDispatch}
                roles={['ROLE_DEVELOPER']}
                groupNames={['chpl-developer']}
              />
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
            </Container>
          )}
        { state === 'edit'
          && (
            <Container maxWidth="lg" id="main-content" tabIndex="-1">
              <ChplDeveloperEdit
                developer={developer}
                dispatch={handleDispatch}
              />
            </Container>
          )}
      </DeveloperContext.Provider>
    </AnalyticsContext.Provider>
  );
}

export default ChplDeveloperPage;

ChplDeveloperPage.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
