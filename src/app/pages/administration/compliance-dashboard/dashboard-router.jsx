import React, { useContext } from 'react';
import { UserContext } from 'shared/contexts';

import ChplAdminDashboard from './admin-dashboard';
import ChplDeveloperDashboard from './developer-dashboard';
import ChplOncDashboard from './onc-dashboard';
import ChplAcbDashboard from './acb-dashboard';

function ChplDashboardRouter() {
  const { hasAnyRole } = useContext(UserContext);

  // Route to appropriate dashboard based on user's highest priority role
  // Priority: Admin > ONC > ACB > Developer
  
  if (hasAnyRole(['chpl-admin'])) {
    return <ChplAdminDashboard />;
  }

  if (hasAnyRole(['chpl-onc'])) {
    return <ChplOncDashboard />;
  }

  if (hasAnyRole(['chpl-onc-acb'])) {
    return <ChplAcbDashboard />;
  }

  if (hasAnyRole(['chpl-developer'])) {
    return <ChplDeveloperDashboard />;
  }

  // Default fallback - should not normally reach here if user is authenticated
  return <ChplAdminDashboard />;
}

export default ChplDashboardRouter;
