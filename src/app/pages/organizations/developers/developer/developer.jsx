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

import { useFetchDeveloperHierarchy } from 'api/developer';
import ChplAttestationsView from 'components/attestation/attestations-view';
import ChplChangeRequests from 'components/change-request/change-requests';
import ChplDeveloper from 'components/developer/developer';
import ChplDirectReviews from 'components/direct-reviews/direct-reviews';
import ChplProducts from 'components/products/products';
import ChplRealWorldTestingView from 'components/real-world-testing/real-world-testing-view';
import ChplUsers from 'components/user/users';
import { getAngularService } from 'services/angular-react-helper';
import { eventTrack } from 'services/analytics.service';
import {
  AnalyticsContext,
  DeveloperContext,
  UserContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplDeveloperPage({ id }) {
  const $state = getAngularService('$state');
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole, user } = useContext(UserContext);
  const { data, isLoading, isSuccess } = useFetchDeveloperHierarchy({ id });
  const [developer, setDeveloper] = useState(undefined);
  const classes = useStyles();
  let analyticsData;

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setDeveloper(data);
  }, [data, isLoading, isSuccess]);

  const can = (action) => {
    switch (action) {
      case 'manageTracking':
        return hasAnyRole(['chpl-developer']);
      default:
        console.error(`Unknown "can": ${action}`);
    }
  };

  const handleDispatch = (action) => {
    switch (action) {
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
            {developer.name}
          </Typography>
        </Container>
        <Container maxWidth="lg" id="main-content" tabIndex="-1">
          <ChplDeveloper
            developer={developer}
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
      </DeveloperContext.Provider>
    </AnalyticsContext.Provider>
  );
}

export default ChplDeveloperPage;

ChplDeveloperPage.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
