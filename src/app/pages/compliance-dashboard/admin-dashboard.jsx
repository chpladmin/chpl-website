import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
} from '@material-ui/core';

function ChplAdminDashboard() {
  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1">
              Welcome to the Admin Dashboard. This dashboard is under development.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default ChplAdminDashboard;
