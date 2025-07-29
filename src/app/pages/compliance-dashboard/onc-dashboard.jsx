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

function ChplOncDashboard() {
  const { user } = useContext(UserContext);
  const classes = useStyles();

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="lg">
        <div className={classes.containerDashboard}>
          <Typography variant="h1" className={classes.titlePadding}>
            ONC Dashboard
          </Typography>
          
          <Card>
            <CardContent>
              <Typography variant="h2" gutterBottom>
                Welcome, {user?.fullName || 'ONC User'}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Office of the National Coordinator
              </Typography>
              <Typography variant="body1">
                ONC oversight dashboard for certification program monitoring and compliance oversight.
              </Typography>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Program Oversight
                  </Typography>
                  <Typography variant="body2">
                    • Certification Program Monitoring<br/>
                    • ACB Performance Review<br/>
                    • Compliance Tracking<br/>
                    • Quality Assurance
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Surveillance & Reviews
                  </Typography>
                  <Typography variant="body2">
                    • Direct Reviews<br/>
                    • Surveillance Activities<br/>
                    • Non-conformity Tracking<br/>
                    • Corrective Actions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Reporting & Analytics
                  </Typography>
                  <Typography variant="body2">
                    • Program Reports<br/>
                    • Compliance Metrics<br/>
                    • Performance Analytics<br/>
                    • Trend Analysis
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Policy & Standards
                  </Typography>
                  <Typography variant="body2">
                    • Certification Criteria<br/>
                    • Program Policies<br/>
                    • Standards Management<br/>
                    • Regulatory Compliance
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

export default ChplOncDashboard;
