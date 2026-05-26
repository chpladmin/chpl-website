import React from 'react';

import ChplSystemMaintenance from './system-maintenance';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplSystemMaintenanceWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader text="System Maintenance" />
      <ChplPageBody>
        <ChplSystemMaintenance />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplSystemMaintenanceWrapper;
