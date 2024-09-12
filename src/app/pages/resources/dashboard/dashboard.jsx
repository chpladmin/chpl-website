import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Button,
  makeStyles,
} from '@material-ui/core';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import GroupOutlinedIcon from '@material-ui/icons/GroupOutlined';
import HighlightOutlinedIcon from '@material-ui/icons/HighlightOutlined';

import { useFetchReportUrl } from 'api/reports';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  container: {
    height: '1200px',
    padding: theme.spacing(8),
    backgroundColor: palette.greyLight,
  },
  stickyCard: {
    position: 'sticky',
    top: '116px',
  },
  card: {
    width: '46%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease, all 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px !important',
    gap: theme.spacing(1),
  },
  cardButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
});

const iconMapping = {
  'Developer Reporting': <AssessmentOutlinedIcon fontSize="large" color="primary" />,
  'Listing Reporting': <DashboardOutlinedIcon fontSize="large" color="primary" />,
  'User Reporting': <GroupOutlinedIcon fontSize="large" color="primary" />,
  'More to Come': <HighlightOutlinedIcon fontSize="large" color="primary" />,
};

function ChplDashboard() {
  const classes = useStyles();
  const developerStatisticsReportUrl = useFetchReportUrl('DeveloperStatistics');
  const [activeCard, setActiveCard] = useState('home');

  const handleCardChange = (card) => setActiveCard(card);

  return (
    <>
      <Box bgcolor={palette.white} p={8}>
        <Container maxWidth="lg">
          <Typography variant="h1">Dashboard</Typography>
        </Container>
      </Box>
      <Box className={classes.container}>
        <Container maxWidth="lg">
          <Box display="flex" flexDirection="row" gridGap={32} width="100%">
            <Box maxWidth="350px">
              <Card className={classes.stickyCard}>
                <CardContent>
                  <Box className={classes.cardButtons}>
                    <Button
                      style={{ justifyContent: 'flex-start' }}
                      color="primary"
                      onClick={() => handleCardChange('home')}
                    >
                      Dashboard
                    </Button>
                    <Button
                      style={{ justifyContent: 'flex-start' }}
                      color="primary"
                      onClick={() => handleCardChange('developerReport')}
                    >
                      Developer Report
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box width="100%">
              {activeCard === 'home' && (
                <Card>
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      <b>Welcome to the CHPL Dashboard</b>
                    </Typography>
                    <Typography gutterBottom>
                      A dynamic reporting suite powered by PowerBI, providing detailed insights and analytics derived from CHPL data. This tool offers interactive reports with robust click-through capabilities, allowing users to explore and analyze data seamlessly. Each report is designed to be user-friendly, enabling in-depth exploration of key metrics and trends, with the flexibility to dive deeper into the numbers that matter most.
                    </Typography>
                    <Box mt={8} mb={4} display="flex" flexDirection="row" flexWrap="wrap" gridGap={32}>
                      {[
                        { text: 'Developer Reporting', page: 'developerReport' },
                        { text: 'Listing Reporting', page: 'listingReport' },
                        { text: 'User Reporting', page: 'userReport' },
                        { text: 'More to Come', page: '' },
                      ].map((item) => (
                        <Card
                          key={item.text}
                          className={classes.card}
                          onClick={() => handleCardChange(item.page)}
                        >
                          <CardContent className={classes.cardContent}>
                            {iconMapping[item.text]}
                            <Typography>{item.text}</Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              )}
              {activeCard === 'developerReport' && (
                <Card style={{ width: '100%' }}>
                  <CardContent>
                    <iframe
                      title="DeveloperStatistics"
                      width="100%"
                      height="1300px"
                      src={developerStatisticsReportUrl?.data?.reportUrl}
                      frameBorder="0"
                      allowFullScreen
                    />
                  </CardContent>
                </Card>
              )}
              {/* Add more conditionally rendered cards here based on `activeCard` value */}
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ChplDashboard;