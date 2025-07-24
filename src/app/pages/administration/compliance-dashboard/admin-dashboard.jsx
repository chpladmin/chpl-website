import React, { useContext } from 'react';
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

function ChplAdminDashboard() {
  const { user } = useContext(UserContext);
  const classes = useStyles();

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="lg">
        <div className={classes.containerDashboard}>
          <Typography variant="h1" className={classes.titlePadding}>
            Admin Dashboard
          </Typography>
          
          <Card>
            <CardContent>
              <Typography variant="h2" gutterBottom>
                Welcome, {user?.fullName || 'Administrator'}
              </Typography>
              <Typography variant="body1">
                System-wide administrative dashboard for CHPL management and oversight.
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    System Management
                  </Typography>
                  <Typography variant="body2">
                    • User Management<br/>
                    • System Configuration<br/>
                    • Global Settings<br/>
                    • Administrative Functions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Oversight & Monitoring
                  </Typography>
                  <Typography variant="body2">
                    • System Health Monitoring<br/>
                    • Compliance Oversight<br/>
                    • Audit Trails<br/>
                    • Performance Metrics
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Data Management
                  </Typography>
                  <Typography variant="body2">
                    • Database Administration<br/>
                    • Data Import/Export<br/>
                    • Backup Management<br/>
                    • System Maintenance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Reports & Analytics
                  </Typography>
                  <Typography variant="body2">
                    • System Reports<br/>
                    • Usage Analytics<br/>
                    • Performance Dashboards<br/>
                    • Custom Reports
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

export default ChplAdminDashboard;
