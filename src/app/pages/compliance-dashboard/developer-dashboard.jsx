import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  IconButton,
  makeStyles,
  Dialog,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
} from '@material-ui/icons';

import DashboardGraphic from '../../../assets/images/dashboard_graphic.svg';

import ChplDeveloperViewDetails from 'components/developer/developer-view';
import ChplAttestationView from 'components/attestation/attestation-view';
import { ChplDialogTitle } from 'components/util';
import { useFilterContext } from 'components/filter';
import { UserContext, DeveloperContext, FlagContext } from 'shared/contexts';
import {
  useFetchDeveloperHierarchy,
  useFetchInsights,
  useFetchUsersAtDeveloper,
  useFetchDirectReviews,
  useFetchRealWorldTestingPlans,
  useFetchRealWorldTestingResults,
  useFetchAttestations,
} from 'api/developer';

const useStyles = makeStyles({
  containerDashboard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '12%',
  },
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 188px)',
  },
  titlePadding: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  welcomeCard: {
    background: '#fff',
    border: '1px solid #ddd',
    position: 'relative',
    overflow: 'visible',
    paddingRight: '16px',
  },
  dashboardGraphic: {
    position: 'absolute',
    top: '60%',
    right: '-4px',
    transform: 'translateY(-50%)',
    zIndex: 10,
    width: '180px',
    height: 'auto',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  userRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  chartPlaceholder: {
    height: '200px',
    background: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  },
  statusOpen: {
    color: '#4caf50',
  },
  statusClosed: {
    color: '#f44336',
  },
  blueNumber: {
    color: '#2196f3',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  developerSelect: {
    minWidth: '80%',
    marginBottom: '16px',
  },
});

function ChplDeveloperDashboard() {
  const { user } = useContext(UserContext);
  const filterContext = useFilterContext();
  const classes = useStyles();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [surveillanceActivities, setSurveillanceActivities] = useState([]);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState(null);
  const [activeAttestations, setActiveAttestations] = useState({});
  const [attestationsDialogOpen, setAttestationsDialogOpen] = useState(false);
  const [safeDeveloper, setSafeDeveloper] = useState({ id: null });
  const [activeDeveloperId, setActiveDeveloperId] = useState(null);

  useEffect(() => {
    const userOrganizations = user?.organizations || [];
    const newActiveDeveloperId = selectedDeveloperId || userOrganizations[0]?.id;
    setActiveDeveloperId(newActiveDeveloperId);
  }, [selectedDeveloperId, user]);

  const { data: developer, isLoading } = useFetchDeveloperHierarchy({
    id: activeDeveloperId,
  });

  useEffect(() => {
    setSafeDeveloper(developer || { id: null });
  }, [developer]);

  const { data: insights, isLoading: insightsLoading } = useFetchInsights({
    developer: safeDeveloper,
  });

  const { data: usersData, isLoading: usersLoading } = useFetchUsersAtDeveloper({
    developer: safeDeveloper,
    enabled: !!developer?.id,
  });

  const { data: directReviews, isLoading: directReviewsLoading } = useFetchDirectReviews({
    developer: safeDeveloper,
  });

  const { data: rwtPlans, isLoading: rwtPlansLoading } = useFetchRealWorldTestingPlans({
    developer: safeDeveloper,
  });

  const { data: rwtResults, isLoading: rwtResultsLoading } = useFetchRealWorldTestingResults({
    developer: safeDeveloper,
  });

  const { data: attestationsData, isLoading: attestationsLoading } = useFetchAttestations({
    developer: safeDeveloper,
    isAuthenticated: !!user,
  });

  useEffect(() => {
    if (!developer?.products) {
      setDisplayedProducts([]);
      return;
    }

    const filtered = developer.products
      .map((product) => ({
        ...product,
        versions: product.versions?.map((version) => ({
          ...version,
          listings: version.listings?.filter(() => true) || [],
        })).filter((version) => version.listings.length > 0) || [],
      }))
      .filter((product) => product.versions.length > 0);

    setDisplayedProducts(filtered);
  }, [developer]);

  useEffect(() => {
    if (usersLoading || !usersData) {
      setDisplayedUsers([]);
      return;
    }
    setDisplayedUsers(usersData.users || []);
  }, [usersData, usersLoading]);

  useEffect(() => {
    const userOrganizations = user?.organizations || [];
    if (userOrganizations.length <= 1) {
      setSelectedDeveloperId(null);
    }
  }, [user]);

  useEffect(() => {
    if (!developer?.products) {
      setSurveillanceActivities([]);
      return;
    }

    const surveillanceData = [];

    developer.products.forEach((product) => {
      product.versions?.forEach((version) => {
        version.listings?.forEach((listing) => {
          listing.surveillance?.forEach((surveillance) => {
            const startDate = surveillance.startDay ? new Date(surveillance.startDay).toLocaleDateString() : '';
            const endDate = surveillance.endDay ? new Date(surveillance.endDay).toLocaleDateString() : '';

            let period = '';
            if (surveillance.endDay) {
              period = `Ended ${endDate}`;
            } else if (surveillance.startDay) {
              period = `Began ${startDate}`;
            } else {
              period = 'Date not specified';
            }

            const status = surveillance.endDay ? 'Close' : 'Open';

            surveillanceData.push({
              id: surveillance.id,
              friendlyId: surveillance.friendlyId,
              period,
              status,
              type: surveillance.type?.name || 'Unknown',
              productName: product.name,
              listingChplProductNumber: listing.chplProductNumber,
              hasNonconformities: surveillance.requirements?.some((req) => req.nonconformities && req.nonconformities.length > 0
              ) || false,
            });
          });
        });
      });
    });

    surveillanceData.sort((a, b) => {
      const dateA = a.period.includes('Ended')
        ? new Date(a.period.replace('Ended ', ''))
        : new Date(a.period.replace('Began ', ''));
      const dateB = b.period.includes('Ended')
        ? new Date(b.period.replace('Ended ', ''))
        : new Date(b.period.replace('Began ', ''));
      return dateB - dateA;
    });

    setSurveillanceActivities(surveillanceData);
  }, [developer]);

  if (isLoading || insightsLoading || usersLoading || directReviewsLoading || rwtPlansLoading || rwtResultsLoading || attestationsLoading) {
    return (
      <div className={classes.fixFooterSpacing}>
        <Container maxWidth="lg">
          <div className={classes.containerDashboard}>
            <Grid container spacing={4} display="flex" flexDirection="row" alignItems="flex-start" alignContent="flex-start">
              {/* Welcome Card Skeleton */}
              <Grid item xs={8} style={{ paddingRight: '32px' }}>
                <Card className={classes.welcomeCard}>
                  <CardContent>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" flexDirection="column" alignItems="flex-start" style={{ maxWidth: '85%' }}>
                        <Skeleton variant="text" width="60%" height={40} style={{ marginBottom: '16px' }} />
                        <Skeleton variant="text" width="100%" height={20} />
                        <Skeleton variant="text" width="90%" height={20} />
                        <Skeleton variant="text" width="80%" height={20} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Right side buttons skeleton */}
              <Grid item style={{ padding: '0' }} xs={4}>
                <Box display="flex" justifyContent="flex-end" marginRight={8} gridGap="8px" alignItems="baseline">
                  <Skeleton variant="rectangular" width={120} height={36} />
                  <Skeleton variant="rectangular" width={150} height={36} />
                </Box>
              </Grid>
            </Grid>

            <Grid style={{ marginBottom: '24px' }} container wrap="nowrap" lg={12} spacing={4}>
              <Grid item xs={8}>
                {/* Top action cards row */}
                <Grid style={{ marginBottom: '24px' }} container spacing={4}>
                  <Grid item xs={4}>
                    <Skeleton variant="rectangular" width="100%" height={100} />
                  </Grid>
                  <Grid item xs={4}>
                    <Skeleton variant="rectangular" width="100%" height={100} />
                  </Grid>
                  <Grid item xs={4}>
                    <Skeleton variant="rectangular" width="100%" height={100} />
                  </Grid>
                </Grid>

                {/* Main content cards */}
                <Grid wrap="nowrap" container spacing={4}>
                  <Grid item xs={12}>
                    {/* Products card skeleton */}
                    <Card style={{ marginBottom: '24px' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Skeleton variant="text" width="40%" height={32} />
                          <Skeleton variant="text" width="10%" height={32} />
                        </Box>
                        <Skeleton variant="text" width="20%" height={24} />
                      </CardContent>
                    </Card>

                    {/* Attestations card skeleton */}
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
                              <Skeleton variant="circular" width={24} height={24} />
                            </Box>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Access Insights card skeleton */}
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

                  {/* Second column of cards */}
                  <Grid item xs={12}>
                    {/* Real World Testing card skeleton */}
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

                    {/* Direct Reviews card skeleton */}
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
                                <Skeleton variant="circular" width={24} height={24} />
                              </Box>
                            </Box>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Surveillance Activities card skeleton */}
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
                              <Skeleton variant="circular" width={24} height={24} />
                            </Box>
                          </Box>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right sidebar skeleton */}
              <Grid item xs={4}>
                {/* Announcements card skeleton */}
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
                    <Skeleton variant="rectangular" width="100%" height={32} style={{ marginTop: '16px' }} />
                  </CardContent>
                </Card>

                {/* Manage Users card skeleton */}
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                      <Skeleton variant="text" width="40%" height={32} />
                      <Skeleton variant="text" width="20%" height={20} />
                    </Box>
                    <Skeleton variant="text" width="100%" height={16} />
                    <Skeleton variant="text" width="80%" height={16} style={{ marginBottom: '16px' }} />

                    <Skeleton variant="rectangular" width="100%" height={40} style={{ marginBottom: '16px' }} />

                    {[1, 2, 3].map((item) => (
                      <Box key={item} display="flex" alignItems="center" style={{ padding: '8px 0' }}>
                        <Skeleton variant="circular" width={40} height={40} style={{ marginRight: '12px' }} />
                        <Box>
                          <Skeleton variant="text" width="120px" height={20} />
                          <Skeleton variant="text" width="150px" height={16} />
                        </Box>
                      </Box>
                    ))}
                  </CardContent>
                </Card>

                {/* Chart skeletons */}
                <Card style={{ marginTop: '24px' }}>
                  <CardContent>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  </CardContent>
                </Card>

                <Box display="flex" justifyContent="space-between">
                  <Card style={{ marginTop: '24px', width: '48%' }}>
                    <CardContent>
                      <Skeleton variant="rectangular" width="100%" height={150} />
                    </CardContent>
                  </Card>
                  <Card style={{ marginTop: '24px', width: '48%' }}>
                    <CardContent>
                      <Skeleton variant="rectangular" width="100%" height={150} />
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

  const filteredUsers = displayedUsers.filter((userData) => userData.fullName?.toLowerCase().includes(localSearchTerm.toLowerCase())
    || userData.email?.toLowerCase().includes(localSearchTerm.toLowerCase()));

  const getUserInitials = (fullName) => {
    if (!fullName) return '??';
    const names = fullName.split(' ');
    const initials = names.map((name) => name.charAt(0).toUpperCase()).join('');
    return initials.substring(0, 2);
  };

  const getUserColor = (email) => {
    const colors = ['#ff9800', '#2196f3', '#f44336', '#4caf50', '#9c27b0', '#607d8b'];
    const hash = email ? email.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : 0;
    return colors[hash % colors.length];
  };

  const handleInfoDialogOpen = () => {
    console.log('Opening info dialog, developer data:', developer);
    setInfoDialogOpen(true);
  };

  const handleInfoDialogClose = () => {
    setInfoDialogOpen(false);
  };

  const handleDeveloperChange = (event) => {
    setSelectedDeveloperId(event.target.value);
  };

  const getActiveDeveloperName = () => {
    const userOrganizations = user?.organizations || [];
    const activeDeveloper = userOrganizations.find((org) => org.id === activeDeveloperId);
    return activeDeveloper?.name || 'Developer';
  };

  const handleAttestationsOpen = (attestation) => {
    setActiveAttestations(attestation);
    setAttestationsDialogOpen(true);
  };

  const handleAttestationsClose = () => {
    setAttestationsDialogOpen(false);
    setActiveAttestations({});
  };

  const handleViewAllProducts = () => {
    const developerName = getActiveDeveloperName();

    if (filterContext && filterContext.setSearchTerm) {
      filterContext.setSearchTerm(encodeURI(developerName));
      window.location.href = '#/search';
    } else {
      window.location.href = `#/search?q=${encodeURIComponent(developerName)}`;
    }
  };

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="lg">
        <div className={classes.containerDashboard}>
          <Grid container spacing={4} display="flex" flexDirection="row" alignItems="flex-start" alignContent="flex-start">
            <Grid item xs={8} style={{ paddingRight: '32px' }}>
              <Card className={classes.welcomeCard}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" flexDirection="column" alignItems="flex-start" style={{ maxWidth: '85%' }}>
                      <Typography variant="h4" className={classes.titlePadding}>
                        {getActiveDeveloperName()}
                      </Typography>
                      <Typography variant="body2">
                        This dashboard is designed to streamline your workflow and help you stay on top of your tasks. With everything in one place, you&apos;ll be able to easily take action, review content, and stay updated with minimal effort.
                      </Typography>
                    </Box>
                    <img
                      src={DashboardGraphic}
                      alt="Dashboard Graphic"
                      className={classes.dashboardGraphic}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{ padding: '0' }} xs={4}>
              <Box
                display="flex"
                justifyContent="flex-end"
                marginRight={8}
                gridGap="8px"
                alignItems="baseline"
              >
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleInfoDialogOpen}
                >
                  Developer Info
                </Button>
                {(user?.organizations || []).length > 1 && (
                  <Box display="flex" justifyContent="center" marginBottom={3}>
                    <FormControl variant="outlined" className={classes.developerSelect}>
                      <InputLabel id="developer-select-label">Select Developer</InputLabel>
                      <Select
                        labelId="developer-select-label"
                        value={activeDeveloperId || ''}
                        onChange={handleDeveloperChange}
                        label="Select Developer"
                        IconComponent={ExpandMoreIcon}
                      >
                        {(user?.organizations || []).map((org) => (
                          <MenuItem key={org.id} value={org.id}>
                            {org.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
          <Grid style={{ marginBottom: '24px' }} container wrap="nowrap" lg={12} spacing={4}>
            <Grid item xs={8}>
              <Grid style={{ marginBottom: '24px' }} container spacing={4}>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Submit A Service Plan URL List Change
                  </Typography>
                  <Skeleton animation="false" variant="rectangular" width="100%" height={100}>

                    <Skeleton animation="false" variant="text" width="60%" height={20} />
                    <Skeleton animation="false" variant="rectangular" width={120} height={24} style={{ marginTop: 8 }} />
                    <Skeleton animation="false" variant="circular" width={40} height={40} style={{ marginTop: 16, marginLeft: 'auto' }} />
                  </Skeleton>
                  {/* Original card - commented out until completion
                  <Card className={classes.actionCard}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" flexDirection="column" alignItems="flex-start">
                        <Typography variant="h6">
                          Submit A Service Plan URL List Change
                        </Typography>
                        <Typography variant="body2" style={{ marginBottom: '16px' }}>
                          URL Status Past
                        </Typography>
                        <Chip label="URL Status Past" color="primary" size="small" />
                      </Box>
                      <IconButton color='primary' style={{ marginTop: '16px' }}>
                        <Send />
                      </IconButton>
                    </Box>
                  </Card>
                  */}
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Pending Change Request
                  </Typography>
                  <Skeleton animation="false" variant="rectangular" width="100%" height={100}>
                    <Skeleton animation="false" variant="text" width="60%" height={20} />
                    <Skeleton animation="false" variant="rectangular" width={120} height={24} style={{ marginTop: 8 }} />
                    <Skeleton animation="false" variant="circular" width={40} height={40} style={{ marginTop: 16, marginLeft: 'auto' }} />
                  </Skeleton>
                  {/* Original card - commented out until completion
                  <Card className={classes.actionCard}>
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">
                          Pending Change Request
                        </Typography>
                        <Typography className={classes.blueNumber}>2</Typography>
                      </Box>
                      <Button
                        variant="text"
                        size="small"
                        color="primary"
                      >
                        View Pending
                      </Button>
                    </CardContent>
                  </Card>
                  */}
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Submitted Change Request
                  </Typography>
                  <Skeleton animation="false" variant="rectangular" width="100%" height={100}>
                    <Skeleton animation="false" variant="text" width="60%" height={20} />
                    <Skeleton animation="false" variant="rectangular" width={120} height={24} style={{ marginTop: 8 }} />
                    <Skeleton animation="false" variant="circular" width={40} height={40} style={{ marginTop: 16, marginLeft: 'auto' }} />
                  </Skeleton>
                  {/* Original card - commented out until completion
                  <Card className={classes.actionCard}>
                    <CardContent>
                      <Typography variant="h6">
                        Submitted Change Request
                      </Typography>
                      <Typography className={classes.greenNumber}>1</Typography>
                      <Button
                        variant="text"
                        size="small"
                        color="primary"
                      >
                        View Submitted
                      </Button>
                    </CardContent>
                  </Card>
                  */}
                </Grid>
              </Grid>
              <Grid wrap="nowrap" container spacing={4}>
                <Grid item xs={12}>
                  <Grid item>
                    <Card style={{ marginBottom: '24px' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">
                            Products Under
                            {' '}
                            {getActiveDeveloperName()}
                          </Typography>
                          <Typography className={classes.blueNumber}>{displayedProducts.length}</Typography>
                        </Box>
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                          onClick={handleViewAllProducts}
                        >
                          View All
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item>
                    <Card style={{ marginBottom: '24px' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                          <Typography variant="h6">Attestations</Typography>
                          <Typography variant="body2">
                            (
                            {attestationsData?.attestations?.length || 0}
                            {' '}
                            Found)
                          </Typography>
                        </Box>
                        <Typography variant="body2" style={{ marginBottom: '16px' }}>
                          Attestations information is displayed here if a health IT developer&apos;s attestation of compliance with ONC&apos;s Conditions of Certification requirements.
                        </Typography>

                        {attestationsData?.attestations && attestationsData.attestations.length > 0 ? (
                          <>
                            <Box display="flex" justifyContent="space-between" style={{ marginBottom: '16px' }}>
                              <Typography variant="subtitle2">Attestations Period</Typography>
                              <Typography variant="subtitle2">Status</Typography>
                            </Box>

                            {attestationsData.attestations.map((attestation, index) => {
                              const periodStart = attestation.attestationPeriod?.periodStart
                                ? new Date(attestation.attestationPeriod.periodStart).toLocaleDateString() : 'N/A';
                              const periodEnd = attestation.attestationPeriod?.periodEnd
                                ? new Date(attestation.attestationPeriod.periodEnd).toLocaleDateString() : 'N/A';
                              const periodDisplay = `${periodStart} to ${periodEnd}`;

                              const isSubmitted = attestation.signature || attestation.signatureDate;
                              const statusDisplay = isSubmitted ? 'Attestations submitted' : 'No Attestations submitted';

                              return (
                                <Box key={attestation.id || index} display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                  <Typography variant="body2">{periodDisplay}</Typography>
                                  <Box display="flex" alignItems="center">
                                    <Typography variant="body2" style={{ marginRight: '8px' }}>
                                      {statusDisplay}
                                    </Typography>
                                    {!isSubmitted ? (
                                      <AddIcon color="primary" />
                                    ) : (
                                      <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => handleAttestationsOpen(attestation)}
                                        aria-label={`View attestations for period ending ${periodEnd}`}
                                      >
                                        <VisibilityIcon color="action" />
                                      </IconButton>
                                    )}
                                  </Box>
                                </Box>
                              );
                            })}
                          </>
                        ) : (
                          <Typography variant="body2" style={{ margin: '12px 0', fontStyle: 'italic' }}>
                            No attestation data available
                          </Typography>
                        )}

                        <Typography variant="body2">
                          For more information, please visit the
                          {' '}
                          <a href="https://www.astp.hhs.gov/sites/default/files/2022-08/Attestations-Condition-Resource-Guide.pdf" target="_blank" rel="noopener noreferrer">Attestations Resource Guide</a>
                          .
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item>
                    <Card>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">Access Insights</Typography>
                          <Typography variant="body2">
                            (
                            {insights?.length || 0}
                            {' '}
                            Found)
                          </Typography>
                        </Box>
                        <Typography variant="body2" style={{ margin: '12px 0' }}>
                          Insights information is displayed here. For more information, please visit the Insights Hub.
                        </Typography>

                        {insights && insights.length > 0 ? (
                          <>
                            <Box display="flex" justifyContent="space-between" style={{ marginBottom: '16px' }}>
                              <Typography variant="subtitle2">Period</Typography>
                              <Typography variant="subtitle2">Status</Typography>
                            </Box>

                            {insights.map((insight, index) => (
                              <Box key={insight.id || `insight-${index}`} display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0', borderBottom: index < insights.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
                                <Typography variant="body2">{insight.period || insight.year || 'N/A'}</Typography>
                                <Typography variant="body2">{insight.status || 'Submitted'}</Typography>
                              </Box>
                            ))}
                          </>
                        ) : (
                          <Typography variant="body2" style={{ margin: '12px 0', fontStyle: 'italic' }}>
                            No insights data available
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Grid item>
                    <Card style={{ marginBottom: '24px' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Real World Testing
                        </Typography>
                        <Typography variant="body2" style={{ marginBottom: '16px' }}>
                          Plans outline the testing approach and criteria while RWT Results provide the outcomes and assess whether the system meets performance requirements under real-world conditions to validate the system&apos;s readiness for real-world healthcare use.
                        </Typography>

                        <Box style={{ marginBottom: '24px' }}>
                          <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '12px' }}>
                            <Typography variant="subtitle2">
                              RWT Plans URLs
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              (
                              {rwtPlans?.length || 0}
                              {' '}
                              Found)
                            </Typography>
                          </Box>

                          {rwtPlans && rwtPlans.length > 0 ? (
                            rwtPlans.slice(0, 3).map((plan, index) => (
                              <a
                                key={plan.id || index}
                                href={plan.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                              >
                                <Typography
                                  variant="body2"
                                  color="primary"
                                  style={{
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    display: 'block',
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  {plan.url || `RWT Plan ${index + 1}`}
                                </Typography>
                              </a>
                            ))
                          ) : (
                            <Typography variant="body2" style={{ fontStyle: 'italic', color: '#666' }}>
                              No RWT Plans URLs available
                            </Typography>
                          )}

                          {rwtPlans && rwtPlans.length > 3 && (
                            <Typography variant="body2" color="primary" style={{ fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}>
                              View all
                              {' '}
                              {rwtPlans.length}
                              {' '}
                              RWT Plans
                            </Typography>
                          )}
                        </Box>

                        <Box>
                          <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '12px' }}>
                            <Typography variant="subtitle2">
                              RWT Results URLs
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              (
                              {rwtResults?.length || 0}
                              {' '}
                              Found)
                            </Typography>
                          </Box>

                          {rwtResults && rwtResults.length > 0 ? (
                            rwtResults.slice(0, 3).map((result, index) => (
                              <a
                                key={result.id || index}
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none' }}
                              >
                                <Typography
                                  variant="body2"
                                  color="primary"
                                  style={{
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    marginBottom: '8px',
                                    display: 'block',
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  {result.url || `RWT Result ${index + 1}`}
                                </Typography>
                              </a>
                            ))
                          ) : (
                            <Typography variant="body2" style={{ fontStyle: 'italic', color: '#666' }}>
                              No RWT Results URLs available
                            </Typography>
                          )}

                          {rwtResults && rwtResults.length > 3 && (
                            <Typography variant="body2" color="primary" style={{ fontSize: '12px', textDecoration: 'underline', cursor: 'pointer' }}>
                              View all
                              {' '}
                              {rwtResults.length}
                              {' '}
                              RWT Results
                            </Typography>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item>
                    <Card style={{ marginBottom: '24px' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">Direct Reviews Activities</Typography>
                          <Typography variant="body2">
                            (
                            {directReviews?.length || 0}
                            {' '}
                            Found)
                          </Typography>
                        </Box>
                        <Typography variant="body2" style={{ margin: '12px 0' }}>
                          Direct Reviews information is displayed here if a Direct Review has been opened by ONC that either affects this developer directly or applies to a health IT module owned by this developer.
                        </Typography>

                        {directReviews && directReviews.length > 0 ? (
                          <>
                            {directReviews.map((review, index) => (
                              <Box key={review.id || index} style={{ marginBottom: '12px' }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                  <Box>
                                    <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                                      {review.jiraKey || `Direct Review ${index + 1}`}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                      {review.developer?.name || 'Developer Name'}
                                    </Typography>
                                  </Box>
                                  <Box display="flex" alignItems="center">
                                    <Typography variant="body2" style={{ marginRight: '8px' }}>
                                      {review.circumstance?.title || 'Status not available'}
                                    </Typography>
                                    <VisibilityIcon color="action" />
                                  </Box>
                                </Box>
                                {review.nonConformityCount !== undefined && (
                                  <Typography variant="body2" style={{ marginTop: '4px' }}>
                                    {review.openNonConformityCount || 0}
                                    {' '}
                                    open /
                                    {review.nonConformityCount || 0}
                                    {' '}
                                    non-conformity found
                                  </Typography>
                                )}
                              </Box>
                            ))}
                          </>
                        ) : (
                          <Typography variant="body2" style={{ fontStyle: 'italic' }}>
                            No direct review activities found
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item>
                    <Card style={{ marginBottom: '24px' }}>
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                          <Typography variant="h6">Surveillance Activities</Typography>
                          <Typography variant="body2">
                            (
                            {surveillanceActivities.length}
                            {' '}
                            Found)
                          </Typography>
                        </Box>
                        <Typography variant="body2" style={{ marginBottom: '16px' }}>
                          Relevant surveillance information that pertains to this listing under this developer can be found here.
                        </Typography>

                        {surveillanceActivities.length === 0 ? (
                          <Typography variant="body2" style={{ margin: '12px 0', fontStyle: 'italic' }}>
                            No surveillance activities found
                          </Typography>
                        ) : (
                          <>
                            <Box display="flex" justifyContent="space-between" style={{ marginBottom: '16px' }}>
                              <Typography variant="subtitle2">Period</Typography>
                              <Typography variant="subtitle2">Status</Typography>
                            </Box>

                            {surveillanceActivities.slice(0, 5).map((item, index) => (
                              <Box key={item.id || `surveillance-${index}`} display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                                <Box>
                                  <Typography variant="body2">{item.period}</Typography>
                                  {item.productName && (
                                    <Typography variant="caption" color="textSecondary">
                                      {item.productName}
                                      {' '}
                                      -
                                      {' '}
                                      {item.type}
                                    </Typography>
                                  )}
                                </Box>
                                <Box display="flex" alignItems="center">
                                  <Typography
                                    variant="body2"
                                    className={item.status === 'Open' ? classes.statusOpen : classes.statusClosed}
                                    style={{ marginRight: '8px' }}
                                  >
                                    {item.status}
                                    {item.hasNonconformities && ' (NC)'}
                                  </Typography>
                                  <VisibilityIcon color="action" />
                                </Box>
                              </Box>
                            ))}

                            {surveillanceActivities.length > 5 && (
                              <Typography variant="body2" color="primary" style={{ marginTop: '12px', textDecoration: 'underline', cursor: 'pointer' }}>
                                View all
                                {' '}
                                {surveillanceActivities.length}
                                {' '}
                                surveillance activities
                              </Typography>
                            )}
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4}>
              <Card style={{ marginBottom: '24px', marginTop: '-84px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Announcements
                  </Typography>
                  <Skeleton animation="false" variant="text" width="80%" height={20} style={{ marginBottom: 8 }} />
                  <Skeleton animation="false" variant="text" width="100%" height={16} style={{ marginBottom: 4 }} />
                  <Skeleton animation="false" variant="text" width="90%" height={16} style={{ marginBottom: 16 }} />

                  <Skeleton animation="false" variant="text" width="75%" height={20} style={{ marginBottom: 8 }} />
                  <Skeleton animation="false" variant="text" width="100%" height={16} style={{ marginBottom: 4 }} />
                  <Skeleton animation="false" variant="text" width="85%" height={16} style={{ marginBottom: 16 }} />

                  <Skeleton animation="false" variant="text" width="85%" height={20} style={{ marginBottom: 8 }} />
                  <Skeleton animation="false" variant="text" width="100%" height={16} style={{ marginBottom: 4 }} />
                  <Skeleton animation="false" variant="text" width="95%" height={16} style={{ marginBottom: 16 }} />

                  <Skeleton animation="false" variant="text" width="70%" height={20} style={{ marginBottom: 8 }} />
                  <Skeleton animation="false" variant="text" width="100%" height={16} style={{ marginBottom: 4 }} />
                  <Skeleton animation="false" variant="text" width="90%" height={16} style={{ marginBottom: 16 }} />

                  <Skeleton variant="rectangular" width="100%" height={32} style={{ marginTop: 16 }} />
                </CardContent>
              </Card>
              {/* Original announcements card - commented out until completion
              <Card style={{ marginBottom: '24px', marginTop: '-64px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Announcements
                  </Typography>
                  <Box style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      • Service Base URL Change Request Window Now Open
                    </Typography>
                    <Typography variant="body2" style={{ fontSize: '12px', color: '#666' }}>
                      Developers can requests your new Shared Service Base URL Change Requests through the ONC Certified Health IT Product List (CHPL) platform, and must submit the window checks on.
                    </Typography>
                  </Box>

                  <Box style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      • Reminder: Check Up on Direct Review Requirements
                    </Typography>
                    <Typography variant="body2" style={{ fontSize: '12px', color: '#666' }}>
                      As part of meeting compliance, we encourage to ensure they have information and can submit documentation as required. (Request an information request on us for more information)
                    </Typography>
                  </Box>

                  <Box style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      • Real World Testing Submission Period Now Open
                    </Typography>
                    <Typography variant="body2" style={{ fontSize: '12px', color: '#666' }}>
                      The submission period for Real World Testing (RWT) Plans and Results is now open. Certified Health IT Developers are encourage to submit their RWT plans or results by March 15, 2024.
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" gutterBottom>
                      • New API Documentation Available!
                    </Typography>
                    <Typography variant="body2" style={{ fontSize: '12px', color: '#666' }}>
                      We've updated our CHPL API documentation with new endpoints and improved examples to help you integrate our services into your workflows. Check us filtering options for certified products. Check out the latest docs.– March 15, 2023
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    size="small"
                    style={{ marginTop: '16px', width: '100%' }}
                  >
                    SEE MORE
                  </Button>
                </CardContent>
              </Card>
              */}

              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                    <Typography variant="h6">Manage User</Typography>
                    <Typography variant="body2">
                      Users (
                      {displayedUsers.length}
                      )
                    </Typography>
                  </Box>

                  <Typography variant="body2" style={{ marginBottom: '16px', fontSize: '12px' }}>
                    You can view all registered users along with the developer they are associated with in the Manage Users Dashboard.
                  </Typography>

                  <TextField
                    placeholder="Search by Name or Email"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={localSearchTerm}
                    onChange={(e) => setLocalSearchTerm(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small">
                            <SearchIcon />
                          </IconButton>
                          <IconButton size="small" />
                        </InputAdornment>
                      ),
                    }}
                    style={{ marginBottom: '16px' }}
                  />

                  {filteredUsers.length === 0 && displayedUsers.length === 0 && (
                    <Typography variant="body2" style={{ fontStyle: 'italic', marginBottom: '16px' }}>
                      No users found for this developer
                    </Typography>
                  )}

                  {filteredUsers.length === 0 && displayedUsers.length > 0 && (
                    <Typography variant="body2" style={{ fontStyle: 'italic', marginBottom: '16px' }}>
                      No users match your search
                    </Typography>
                  )}

                  {filteredUsers.map((userData) => (
                    <Box key={userData.cognitoId || userData.id} className={classes.userRow}>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          className={classes.userAvatar}
                          style={{ backgroundColor: getUserColor(userData.email), marginRight: '12px' }}
                        >
                          {getUserInitials(userData.fullName)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                            {userData.fullName || 'Unknown User'}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '12px', color: '#666' }}>
                            {userData.email || 'No email'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>
              <Card style={{ marginTop: '24px' }}>
                <CardContent>
                  <div className={classes.chartPlaceholder}>
                    Amount Developer Was Searched Developer Page Visited
                  </div>
                </CardContent>
              </Card>
              <Box display="flex" justifyContent="space-between">
                <Card style={{ marginTop: '24px' }}>
                  <CardContent>
                    <Box style={{ marginTop: '16px' }}>
                      <div className={classes.chartPlaceholder}>
                        Chart Visualization Here
                      </div>
                    </Box>
                  </CardContent>
                </Card>
                <Card style={{ marginTop: '24px' }}>
                  <CardContent>
                    <Box>
                      <div className={classes.chartPlaceholder}>
                        Chart Visualization Here
                      </div>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </div>
      </Container>

      {/* Developer Details Dialog */}
      <Dialog
        open={infoDialogOpen}
        onClose={handleInfoDialogClose}
        maxWidth="md"
        fullWidth
      >
        {developer ? (
          <DeveloperContext.Provider value={{ developer }}>
            <FlagContext.Provider value={{ demographicChangeRequestIsOn: false }}>
              <UserContext.Provider value={{
                hasAnyRole: () => false, // Disable all role-based permissions
                user: null,
              }}
              >
                <Button onClick={handleInfoDialogClose} color="primary">
                  Close
                </Button>
                <ChplDeveloperViewDetails
                  dispatch={() => {}} // Empty dispatch function for view-only mode
                  canEdit={() => false} // Disable editing in dialog
                  canJoin={() => false} // Disable joining in dialog
                  canSplit={() => false} // Disable splitting in dialog
                  isSplitting={false}
                />
              </UserContext.Provider>
            </FlagContext.Provider>

          </DeveloperContext.Provider>
        ) : (
          <div>
            <Typography>Loading developer information...</Typography>
            <Typography variant="body2">
              Developer ID:
              {activeDeveloperId}
            </Typography>
            <Typography variant="body2">
              Is Loading:
              {isLoading ? 'Yes' : 'No'}
            </Typography>
          </div>
        )}

      </Dialog>

      {/* Attestations Details Dialog */}
      {activeAttestations && Object.keys(activeAttestations).length > 0 && (
        <Dialog
          fullWidth
          maxWidth="md"
          open={attestationsDialogOpen}
          onClose={handleAttestationsClose}
          aria-labelledby="attestations-details"
        >
          <ChplDialogTitle
            id="attestations-details"
            onClose={handleAttestationsClose}
          >
            View Attestations Details
          </ChplDialogTitle>
          <DialogContent dividers>
            <ChplAttestationView
              attestations={activeAttestations}
              canCreateException={false}
              developer={developer}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
export default ChplDeveloperDashboard;
