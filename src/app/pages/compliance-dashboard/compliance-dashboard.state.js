const states = [{
  name: 'compliance-dashboard',
  url: '/compliance-dashboard',
  component: 'chplComplianceDashboardBridge',
  data: {
    title: 'Compliance Dashboard',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}];

function complianceDashboardStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default complianceDashboardStatesConfig;
