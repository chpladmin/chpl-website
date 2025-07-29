import React, { useContext, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  makeStyles,
} from '@material-ui/core';

import { UserContext } from 'shared/contexts';

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
  card: {
    minHeight: '200px',
  },
});

function ChplDeveloperDashboard() {
  const { hasAnyRole, user } = useContext(UserContext);
  const [developer, setDeveloper] = useState(null);
  const classes = useStyles();

  // Get developer information
  useEffect(() => {
    if (hasAnyRole(['chpl-developer']) && user?.organizations?.length > 0) {
      setDeveloper(user.organizations[0]);
    }
  }, [user, hasAnyRole]);

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="lg">
        <div className={classes.containerDashboard}>
          <Typography variant="h1" className={classes.titlePadding}>
            Developer Dashboard
          </Typography>
          
          <Card>
            <CardContent>
              <Typography variant="h2" gutterBottom>
                Welcome, {user?.fullName || 'Developer'}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Organization: {developer?.name || 'Loading...'}
              </Typography>
              <Typography variant="body1">
                Manage your organization's products, certifications, and compliance activities.
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Product Management
                  </Typography>
                  <Typography variant="body2">
                    • View Your Products<br/>
                    • Certification Status<br/>
                    • Product Updates<br/>
                    • Version Management
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Compliance & Attestations
                  </Typography>
                  <Typography variant="body2">
                    • Submission Requirements<br/>
                    • Attestation Status<br/>
                    • Compliance Reports<br/>
                    • Real World Testing
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Change Requests
                  </Typography>
                  <Typography variant="body2">
                    • Submit Changes<br/>
                    • Track Request Status<br/>
                    • Review History<br/>
                    • Update Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Organization Management
                  </Typography>
                  <Typography variant="body2">
                    • User Management<br/>
                    • Contact Information<br/>
                    • Organization Details<br/>
                    • Account Settings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default ChplDeveloperDashboard;
