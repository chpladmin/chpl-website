import React from 'react';

import ChplSystemMaintenance from './system-maintenance';

import AppWrapper from 'app-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';

function ChplSystemMaintenanceWrapper() {
  return (
    <AppWrapper>
      <BreadcrumbWrapper title="System Maintenance">
        <ChplSystemMaintenance />
      </BreadcrumbWrapper>
    </AppWrapper>
  );
}

export default ChplSystemMaintenanceWrapper;

ChplSystemMaintenanceWrapper.propTypes = {
};
