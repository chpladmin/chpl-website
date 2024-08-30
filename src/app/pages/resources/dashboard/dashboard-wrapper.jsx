import React from 'react';

import Dashboard from './dashboard';

import AppWrapper from 'app-wrapper';

function DashboardWrapper() {
  return (
    <AppWrapper>
      <Dashboard />
    </AppWrapper>
  );
}

export default DashboardWrapper;

DashboardWrapper.propTypes = {
};