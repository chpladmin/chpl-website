import React from 'react';

import ChplComplianceDashboard from './compliance-dashboard';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplComplianceDashboardWrapper() {
  return (
    <AppWrapper>
      <ChplPageHeader 
        text="Compliance Dashboard" 
        subtitle="A comprehensive view of compliance reports and metrics"
      />
      <ChplPageBody>
        <ChplComplianceDashboard />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplComplianceDashboardWrapper;

ChplComplianceDashboardWrapper.propTypes = {
};
