import React from 'react';

import ChplDashboard from './dashboard';

import AppWrapper from 'app-wrapper';

function ChplDashboardWrapper() {
  return (
    <AppWrapper>
      <ChplDashboard />
    </AppWrapper>
  );
}

export default ChplDashboardWrapper;

ChplDashboardWrapper.propTypes = {
};