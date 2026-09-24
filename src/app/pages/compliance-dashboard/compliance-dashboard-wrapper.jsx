import React from 'react';

import ChplComplianceDashboard from './compliance-dashboard';

import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplComplianceDashboardWrapper() {
  return (
    <>
      <ChplPageHeader
        text="Compliance Dashboard"
        subtitle="A comprehensive view of compliance reports and metrics"
      />
      <ChplPageBody>
        <ChplComplianceDashboard />
      </ChplPageBody>
    </>
  );
}

export default ChplComplianceDashboardWrapper;

ChplComplianceDashboardWrapper.propTypes = {
};
