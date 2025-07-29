import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  makeStyles,
} from '@material-ui/core';

import { 
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
} from '@material-ui/icons';

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
  welcomeCard: {
    background: '#f8f9fa',
    border: '1px solid #e9ecef',
  },
  laptopGraphic: {
    width: '120px',
    height: '80px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '80px',
      height: '50px',
      background: '#fff',
      borderRadius: '4px',
    },
  },
  actionCard: {
    textAlign: 'left',
    padding: '20px',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      cursor: 'pointer',
    },
  },
  numberDisplay: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2196f3',
  },
  contentSection: {
    marginTop: '16px',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    marginBottom: '12px',
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
  greenNumber: {
    color: '#4caf50',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
});

function ChplAdminDashboard() {
  const { user } = useContext(UserContext);
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');

  const mockUsers = [
    { id: 1, name: 'Johnny Joes', email: 'jjoe@email', initials: 'JJ', color: '#ff9800' },
    { id: 2, name: 'Bob Burgers', email: 'bob@developer', initials: 'BB', color: '#2196f3' },
    { id: 3, name: 'Susan S', email: 'chpl-developer', initials: 'SS', color: '#f44336' },
    { id: 4, name: 'Tony Tom', email: 'chpl-developer', initials: 'TT', color: '#4caf50' },
  ];

  const mockAttestations = [
    { date: 'Apr 1, 2024 to Sep 30, 2024', status: 'No Attestations submitted' },
    { date: 'Oct 1, 2023 to Mar 31, 2024', status: 'Attestations submitted' },
    { date: 'Apr 1, 2023 to Sep 30, 2023', status: 'Attestations submitted' },
    { date: 'Oct 1, 2022 to Mar 31, 2023', status: 'Attestations submitted' },
    { date: 'Apr 1, 2022 to Sep 30, 2022', status: 'Attestations submitted' },
  ];

  const mockSurveillance = [
    { period: 'Ended Nov 27, 2023', status: 'Close' },
    { period: 'Began Oct 22, 2023', status: 'Open' },
    { period: 'Began Oct 22, 2024', status: 'Open' },
    { period: 'Ended Mar 31, 2024', status: 'Close' },
    { period: 'Began May 5, 2022', status: 'Open' },
  ];

  return (
    <div className={classes.fixFooterSpacing}>
      <Container maxWidth="lg">
        <div className={classes.containerDashboard}>
          <Card>
          <Typography variant="h1" className={classes.titlePadding}>
            Welcome Epic Systems Corporation to the CHPL Compliance Dashboard
          </Typography>
          
          <Typography variant="body2">
            This dashboard is designed to streamline your workflow and help you stay on top of your tasks. With everything in one place, you'll be able to easily take action, review content, and stay updated with minimal effort.
          </Typography>
          <Box className={classes.laptopGraphic}>
            <img src="assets/images/CHPL_Logo-01.png" alt="Laptop Graphic" style={{ width: '100%', height: '100%' }} />
          </Box>
        </Card>
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              {/* Action Cards */}
              <Grid container spacing={2} style={{ marginBottom: '24px' }}>
                <Grid item xs={4}>
                  <Card className={classes.actionCard}>
                    <CardContent>
                      <Typography variant="h6" color="primary">
                        Submit A Service Plan URL List Change
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        style={{ marginTop: '8px' }}
                      >
                        URL Status Past
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={4}>
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
                </Grid>
                <Grid item xs={4}>
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
                </Grid>
              </Grid>

              {/* Products Under Epic Systems Corporation */}
              <Card style={{ marginBottom: '24px' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                      Products Under Epic Systems Corporation
                    </Typography>
                    <Typography className={classes.blueNumber}>6</Typography>
                  </Box>
                  <Button variant="text" color="primary" size="small">
                    View All
                  </Button>
                </CardContent>
              </Card>

              {/* Real World Testing */}
              <Card style={{ marginBottom: '24px' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Real World Testing
                  </Typography>
                  <Typography variant="body2" style={{ marginBottom: '16px' }}>
                    Plans OBLs outline the testing approach and criteria upon against while RWT Results provide the outcomes and assess whether the system meets performance requirements under real-world conditions to validate the system's readiness for real-world healthcare use.
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    RWT Plans URLs
                  </Typography>
                  <Typography variant="body2" color="primary" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    https://products.demo.myhealth-world-test-url-plans-host-listview-liaw...
                  </Typography>
                  
                  <Typography variant="subtitle2" gutterBottom style={{ marginTop: '12px' }}>
                    RWT Plans
                  </Typography>
                  <Typography variant="body2" color="primary" style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                    https://demo.products-my-world-test-url-plans-host-analytics-liaw...
                  </Typography>
                </CardContent>
              </Card>

              {/* Attestations */}
              <Card style={{ marginBottom: '24px' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                    <Typography variant="h6">Attestations</Typography>
                    <Button variant="outlined" size="small">Status</Button>
                  </Box>
                  <Typography variant="body2" style={{ marginBottom: '16px' }}>
                    Attestations information is displayed here if a health IT developer's attestation of compliance with ONC's Conditions of Certification requirements.
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle2">Attestations Period</Typography>
                    <Typography variant="subtitle2">Status</Typography>
                  </Box>

                  {mockAttestations.map((attestation, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Typography variant="body2">{attestation.date}</Typography>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" style={{ marginRight: '8px' }}>
                          {attestation.status}
                        </Typography>
                        {attestation.status === 'No Attestations submitted' ? (
                          <AddIcon color="primary" />
                        ) : (
                          <VisibilityIcon color="action" />
                        )}
                      </Box>
                    </Box>
                  ))}
                  
                  <Typography variant="body2" color="primary" style={{ marginTop: '12px', textDecoration: 'underline', cursor: 'pointer' }}>
                    For more information, please visit the Attestations Resource Guide.
                  </Typography>
                </CardContent>
              </Card>

              {/* Direct Reviews Activities */}
              <Card style={{ marginBottom: '24px' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Direct Reviews Activities</Typography>
                    <Typography variant="body2">(1 Found)</Typography>
                  </Box>
                  <Typography variant="body2" style={{ margin: '12px 0' }}>
                    Direct Reviews information is displayed here if a Direct Review has been opened by ONC that either affects this developer directly or applies to a health IT module owned by this developer.
                  </Typography>
                  <Typography variant="body2">1 open / 1 non-conformity found</Typography>
                  <VisibilityIcon color="action" style={{ marginTop: '8px' }} />
                </CardContent>
              </Card>

              {/* Surveillance Activities */}
              <Card style={{ marginBottom: '24px' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                    <Typography variant="h6">Surveillance Activities</Typography>
                    <Typography variant="body2">(5 Found)</Typography>
                  </Box>
                  <Typography variant="body2" style={{ marginBottom: '16px' }}>
                    Relevant surveillance information that pertains to this listing under this developer can be found here.
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle2">Period</Typography>
                    <Typography variant="subtitle2">Status</Typography>
                  </Box>

                  {mockSurveillance.map((item, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                      <Typography variant="body2">{item.period}</Typography>
                      <Box display="flex" alignItems="center">
                        <Typography 
                          variant="body2" 
                          className={item.status === 'Open' ? classes.statusOpen : classes.statusClosed}
                          style={{ marginRight: '8px' }}
                        >
                          {item.status}
                        </Typography>
                        <VisibilityIcon color="action" />
                      </Box>
                    </Box>
                  ))}
                </CardContent>
              </Card>

              {/* Access Insights */}
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Access Insights</Typography>
                    <Typography variant="body2">(2 Found)</Typography>
                  </Box>
                  <Typography variant="body2" style={{ margin: '12px 0' }}>
                    Insights information is displayed here. For more information, please visit the Insights Hub.
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" style={{ marginBottom: '16px' }}>
                    <Typography variant="subtitle2">Period</Typography>
                    <Typography variant="subtitle2">Status</Typography>
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <Typography variant="body2">2027</Typography>
                    <Typography variant="body2">Submitted</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center" style={{ padding: '8px 0' }}>
                    <Typography variant="body2">2024</Typography>
                    <Typography variant="body2">Submitted</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={4}>
              {/* Announcements */}
              <Card style={{ marginBottom: '24px' }}>
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

              {/* Manage User */}
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" style={{ marginBottom: '16px' }}>
                    <Typography variant="h6">Manage User</Typography>
                    <Typography variant="body2">Users (4)</Typography>
                  </Box>
                  
                  <Typography variant="body2" style={{ marginBottom: '16px', fontSize: '12px' }}>
                    You can view all registered users along with the developer they are associated with in the Manage Users Dashboard.
                  </Typography>

                  <TextField
                    placeholder="Search by Name or Email"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small">
                            <SearchIcon />
                          </IconButton>
                          <IconButton size="small">
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      )
                    }}
                    style={{ marginBottom: '16px' }}
                  />

                  {mockUsers.map((user) => (
                    <Box key={user.id} className={classes.userRow}>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          className={classes.userAvatar}
                          style={{ backgroundColor: user.color, marginRight: '12px' }}
                        >
                          {user.initials}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="body2" style={{ fontSize: '12px', color: '#666' }}>
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Box>
                  ))}

                  <Typography variant="body2" style={{ marginTop: '16px', textAlign: 'center' }}>
                    7 total subscriptions to your products
                  </Typography>

                  {/* Chart Placeholder */}
                  <Box style={{ marginTop: '16px' }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Amount Developer Was Searched    Developer Page Visited
                    </Typography>
                    <div className={classes.chartPlaceholder}>
                      Chart Visualization Here
                    </div>
                  </Box>
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