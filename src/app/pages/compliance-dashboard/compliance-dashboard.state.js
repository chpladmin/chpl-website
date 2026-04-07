const states = [{
  name: 'compliance-dashboard',
  url: '/compliance-dashboard',
  component: 'chplComplianceDashboardBridge',
  data: {
    title: 'ASTP Compliance Dashboard',
    roles: ['chpl-admin'],
  },
}];

function complianceDashboardStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default complianceDashboardStatesConfig;
