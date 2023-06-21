import React from 'react';

import ChplOncOrganizations from './onc-organizations';

import AppWrapper from 'app-wrapper';
import BreadcrumbWrapper from 'components/breadcrumb/breadcrumb-wrapper';

function ChplOncOrganizationsWrapper() {
  return (
    <AppWrapper>
      <BreadcrumbWrapper title="ONC Organizations">
        <ChplOncOrganizations />
      </BreadcrumbWrapper>
    </AppWrapper>
  );
}

export default ChplOncOrganizationsWrapper;

ChplOncOrganizationsWrapper.propTypes = {
};
