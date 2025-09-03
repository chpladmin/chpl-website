import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';

import ChplDeveloperDashboard from './developer-dashboard';

import { UserContext } from 'shared/contexts';

function ChplDashboardRouter() {
  const { hasAnyRole } = useContext(UserContext);

  if (hasAnyRole(['chpl-developer'])) {
    return <ChplDeveloperDashboard />;
  }

  return (
    <Typography variant="h6" style={{ padding: '20px', textAlign: 'center' }}>
      This page is still in development
    </Typography>
  );
}

export default ChplDashboardRouter;
