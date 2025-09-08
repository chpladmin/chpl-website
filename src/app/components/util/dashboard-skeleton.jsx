import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  makeStyles,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles({
  containerDashboard: {
    display: 'flex',
    gap: '16px',
    marginTop: '12%',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 188px)',
  },
  welcomeCard: {
    background: '#fff',
    border: '1px solid #ddd',
    position: 'relative',
    overflow: 'visible',
    paddingRight: '16px',
  },
});

function ChplDashboardSkeleton() {
  const classes = useStyles();

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="lg">
        <div className={classes.containerDashboard}>
          <Grid container spacing={4} display="flex" alignItems="flex-start" alignContent="flex-start">
            <Grid item xs={8} style={{ paddingRight: '32px' }}>
              <Card className={classes.welcomeCard}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="flex-start" style={{ maxWidth: '85%' }}>
                      <Skeleton variant="text" width="60%" height={40} style={{ marginBottom: '16px' }} />
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="90%" height={20} />
                      <Skeleton variant="text" width="80%" height={20} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{ padding: '0' }} xs={4}>
              <Box display="flex" justifyContent="flex-end" marginRight={8} gridGap="8px" alignItems="baseline">
                <Skeleton variant="rect" width={120} height={36} />
                <Skeleton variant="rect" width={150} height={36} />
              </Box>
            </Grid>
          </Grid>
          <Grid style={{ marginBottom: '24px' }} container wrap="nowrap" spacing={4}>
            <Grid item xs={8}>
              <Grid style={{ marginBottom: '24px' }} container spacing={4}>
                <Grid item xs={4}>
                  <Skeleton variant="rect" width="100%" height={100} />
                </Grid>
                <Grid item xs={4}>
                  <Skeleton variant="rect" width="100%" height={100} />
                </Grid>
                <Grid item xs={4}>
                  <Skeleton variant="rect" width="100%" height={100} />
                </Grid>
              </Grid>
              <Grid wrap="nowrap" container spacing={4}>
                <Grid item xs={12}>
                  <Card style={{ marginBottom: '24px' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Skeleton variant="text" width="40%" height={32} />
                        <Skeleton variant="text" width="10%" height={32} />
                      </Box>
                      <Skeleton variant="text" width="20%" height={24} />
                    </CardContent>
                  </Card>
                  <Card style={{ marginBottom: '24px' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                        <Skeleton variant="text" width="30%" height={32} />
                        <Skeleton variant="text" width="15%" height={20} />
                      </Box>
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="90%" height={20} style={{ marginBottom: '16px' }} />
                      <Box display="flex" justifyContent="space-between" style={{ marginBottom: '16px' }}>
                        <Skeleton variant="text" width="25%" height={20} />
                        <Skeleton variant="text" width="15%" height={20} />
                      </Box>
                      {[1, 2, 3].map((item) => (
                        <Box key={item} display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0' }}>
                          <Skeleton variant="text" width="40%" height={20} />
                          <Box display="flex" alignItems="center">
                            <Skeleton variant="text" width="30%" height={20} style={{ marginRight: '8px' }} />
                            <Skeleton variant="circle" width={24} height={24} />
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Skeleton variant="text" width="30%" height={32} />
                        <Skeleton variant="text" width="15%" height={20} />
                      </Box>
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="80%" height={20} style={{ marginBottom: '16px' }} />
                      {[1, 2].map((item) => (
                        <Box key={item} display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0' }}>
                          <Skeleton variant="text" width="30%" height={20} />
                          <Skeleton variant="text" width="20%" height={20} />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card style={{ marginBottom: '24px' }}>
                    <CardContent>
                      <Skeleton variant="text" width="40%" height={32} style={{ marginBottom: '16px' }} />
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="90%" height={20} style={{ marginBottom: '24px' }} />
                      <Box style={{ marginBottom: '24px' }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '12px' }}>
                          <Skeleton variant="text" width="25%" height={20} />
                          <Skeleton variant="text" width="15%" height={16} />
                        </Box>
                        {[1, 2, 3].map((item) => (
                          <Skeleton key={item} variant="text" width="100%" height={16} style={{ marginBottom: '8px' }} />
                        ))}
                      </Box>
                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '12px' }}>
                          <Skeleton variant="text" width="25%" height={20} />
                          <Skeleton variant="text" width="15%" height={16} />
                        </Box>
                        {[1, 2, 3].map((item) => (
                          <Skeleton key={item} variant="text" width="100%" height={16} style={{ marginBottom: '8px' }} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                  <Card style={{ marginBottom: '24px' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Skeleton variant="text" width="40%" height={32} />
                        <Skeleton variant="text" width="15%" height={20} />
                      </Box>
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="85%" height={20} style={{ marginBottom: '16px' }} />
                      {[1, 2].map((item) => (
                        <Box key={item} style={{ marginBottom: '12px' }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                              <Skeleton variant="text" width="60%" height={20} />
                              <Skeleton variant="text" width="40%" height={16} />
                            </Box>
                            <Box display="flex" alignItems="center">
                              <Skeleton variant="text" width="30%" height={20} style={{ marginRight: '8px' }} />
                              <Skeleton variant="circle" width={24} height={24} />
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                  <Card style={{ marginBottom: '24px' }}>
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                        <Skeleton variant="text" width="40%" height={32} />
                        <Skeleton variant="text" width="15%" height={20} />
                      </Box>
                      <Skeleton variant="text" width="100%" height={20} />
                      <Skeleton variant="text" width="80%" height={20} style={{ marginBottom: '16px' }} />
                      <Box display="flex" justifyContent="space-between" style={{ marginBottom: '16px' }}>
                        <Skeleton variant="text" width="15%" height={20} />
                        <Skeleton variant="text" width="15%" height={20} />
                      </Box>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <Box key={item} display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0' }}>
                          <Box>
                            <Skeleton variant="text" width="50%" height={20} />
                            <Skeleton variant="text" width="60%" height={16} />
                          </Box>
                          <Box display="flex" alignItems="center">
                            <Skeleton variant="text" width="20%" height={20} style={{ marginRight: '8px' }} />
                            <Skeleton variant="circle" width={24} height={24} />
                          </Box>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Card style={{ marginBottom: '24px', marginTop: '-84px' }}>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} style={{ marginBottom: '16px' }} />
                  {[1, 2, 3, 4].map((item) => (
                    <Box key={item} style={{ marginBottom: '16px' }}>
                      <Skeleton variant="text" width="85%" height={20} style={{ marginBottom: '8px' }} />
                      <Skeleton variant="text" width="100%" height={16} />
                      <Skeleton variant="text" width="90%" height={16} />
                    </Box>
                  ))}
                  <Skeleton variant="rect" width="100%" height={32} style={{ marginTop: '16px' }} />
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                    <Skeleton variant="text" width="40%" height={32} />
                    <Skeleton variant="text" width="20%" height={20} />
                  </Box>
                  <Skeleton variant="text" width="100%" height={16} />
                  <Skeleton variant="text" width="80%" height={16} style={{ marginBottom: '16px' }} />
                  <Skeleton variant="rect" width="100%" height={40} style={{ marginBottom: '16px' }} />
                  {[1, 2, 3].map((item) => (
                    <Box key={item} display="flex" alignItems="center" style={{ padding: '8px 0' }}>
                      <Skeleton variant="circle" width={40} height={40} style={{ marginRight: '12px' }} />
                      <Box>
                        <Skeleton variant="text" width="120px" height={20} />
                        <Skeleton variant="text" width="150px" height={16} />
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
              <Card style={{ marginTop: '24px' }}>
                <CardContent>
                  <Skeleton variant="rect" width="100%" height={200} />
                </CardContent>
              </Card>
              <Box display="flex" justifyContent="space-between">
                <Card style={{ marginTop: '24px', width: '48%' }}>
                  <CardContent>
                    <Skeleton variant="rect" width="100%" height={150} />
                  </CardContent>
                </Card>
                <Card style={{ marginTop: '24px', width: '48%' }}>
                  <CardContent>
                    <Skeleton variant="rect" width="100%" height={150} />
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default ChplDashboardSkeleton;
