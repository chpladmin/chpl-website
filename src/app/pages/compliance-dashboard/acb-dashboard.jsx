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

function ChplAcbDashboard() {
  const { user } = useContext(UserContext);
  const classes = useStyles();

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="lg">
        <div className={classes.containerDashboard}>
          <Typography variant="h1" className={classes.titlePadding}>
            ACB Dashboard
          </Typography>
          
          <Card>
            <CardContent>
              <Typography variant="h2" gutterBottom>
                Welcome, {user?.fullName || 'ACB User'}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Authorized Certification Body
              </Typography>
              <Typography variant="body1">
                ACB dashboard for managing certifications, reviews, and compliance oversight activities.
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Certification Management
                  </Typography>
                  <Typography variant="body2">
                    • Product Certifications<br/>
                    • Certification Reviews<br/>
                    • Status Tracking<br/>
                    • Certificate Issuance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Testing & Validation
                  </Typography>
                  <Typography variant="body2">
                    • Test Plans<br/>
                    • Test Results<br/>
                    • Validation Reports<br/>
                    • Quality Assurance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Surveillance Activities
                  </Typography>
                  <Typography variant="body2">
                    • Surveillance Plans<br/>
                    • Non-conformity Reports<br/>
                    • Corrective Actions<br/>
                    • Follow-up Reviews
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Compliance & Reporting
                  </Typography>
                  <Typography variant="body2">
                    • Compliance Reports<br/>
                    • ONC Reporting<br/>
                    • Performance Metrics<br/>
                    • Audit Documentation
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

export default ChplAcbDashboard;
