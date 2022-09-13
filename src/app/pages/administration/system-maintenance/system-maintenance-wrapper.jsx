import React from 'react';

import ChplSystemMaintenance from './system-maintenance';

import ApiWrapper from 'api/api-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';
import { UserWrapper } from 'components/login';

function ChplSystemMaintenanceWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <BreadcrumbWrapper>
          <ChplSystemMaintenance />
        </BreadcrumbWrapper>
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplSystemMaintenanceWrapper;

ChplSystemMaintenanceWrapper.propTypes = {
};
