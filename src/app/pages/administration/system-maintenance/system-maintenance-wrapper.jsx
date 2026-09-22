import React from 'react';

import ChplSystemMaintenance from './system-maintenance';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplSystemMaintenanceWrapper() {
  return (
    <>
      <ChplPageHeader text="System Maintenance" />
      <ChplPageBody>
        <ChplSystemMaintenance />
      </ChplPageBody>
    </>
  );
}

export default ChplSystemMaintenanceWrapper;
