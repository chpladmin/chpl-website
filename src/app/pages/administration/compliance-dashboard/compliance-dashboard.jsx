import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { useFetchUsersAtDeveloper } from 'api/developer';
import ChplAttestationsView from 'components/attestation/attestations-view';
import ChplChangeRequests from 'components/change-request/change-requests-wrapper';
import ChplDirectReviews from 'components/direct-reviews/direct-reviews';
import ChplInsightsView from 'components/insights/insights-view';
import ChplProducts from 'components/products/products';
import ChplRealWorldTestingView from 'components/real-world-testing/real-world-testing-view';
import ChplUsers from 'components/user/users';
import { FlagContext, UserContext } from 'shared/contexts';
import { theme } from 'themes';

const useStyles = makeStyles({
  containerDashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 188px)',
  },
  titlePadding: {
    paddingTop: '16px',
    paddingBottom: '16px',
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
  righthandColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    width: '100%',
  },
});

function ChplComplianceDashboard() {
  const { hasAnyRole, user } = useContext(UserContext);
  const { insightsIsOn } = useContext(FlagContext);
  const [users, setUsers] = useState([]);
  const [developer, setDeveloper] = useState(null);
  const classes = useStyles();

  // For developers, get their associated developer information
  useEffect(() => {
    if (hasAnyRole(['chpl-developer']) && user?.organizations?.length > 0) {
      // Use the first developer organization for the user
      setDeveloper(user.organizations[0]);
    }
  }, [user, hasAnyRole]);

  const usersQuery = useFetchUsersAtDeveloper({
    developer,
    enabled: developer && (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) || (hasAnyRole(['chpl-developer']) && developer)),
  });

  useEffect(() => {
    if (usersQuery.isLoading || !usersQuery.isSuccess) { return; }
    setUsers(usersQuery.data?.users || []);
  }, [usersQuery.data, usersQuery.isLoading, usersQuery.isSuccess]);

  const handleDispatch = (action, payload) => {
    // Handle various actions based on user role and action type
    console.log('Compliance Dashboard Action:', action, payload);
    // Add specific handling logic here based on requirements
  };

  // Determine what components to show based on user role
  const canViewInsights = () => insightsIsOn && (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) || (hasAnyRole(['chpl-developer']) && developer));
  const canViewChangeRequests = () => hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-developer']);
  const canViewDirectReviews = () => hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) || (hasAnyRole(['chpl-developer']) && developer);
  const canViewProducts = () => hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) || (hasAnyRole(['chpl-developer']) && developer);
  const canViewUsers = () => hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) || (hasAnyRole(['chpl-developer']) && developer);
  const canViewAttestations = () => hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) || (hasAnyRole(['chpl-developer']) && developer);
  const canViewRealWorldTesting = () => hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) || (hasAnyRole(['chpl-developer']) && developer);

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="lg">
        <div className={classes.containerDashboard}>
          <Typography variant="h1" className={classes.titlePadding}>
            Compliance Dashboard
          </Typography>
          
          <Card>
            <CardContent>
              <Typography variant="h2" gutterBottom>
                Compliance Overview
              </Typography>
              <Typography variant="body1">
                This is the compliance dashboard where you can view and manage compliance-related information.
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Quick Stats
              </Typography>
              <Typography variant="body1">
                • Total Listings: Pending implementation
              </Typography>
              <Typography variant="body1">
                • Compliance Status: Pending implementation
              </Typography>
              <Typography variant="body1">
                • Recent Activities: Pending implementation
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Actions
              </Typography>
              <Typography variant="body1">
                Dashboard functionality will be implemented here.
              </Typography>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}

export default ChplComplianceDashboard;
