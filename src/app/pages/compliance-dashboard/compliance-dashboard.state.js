const states = [{
  name: 'compliance-dashboard',
  url: '/compliance-dashboard',
  component: 'chplComplianceDashboardWrapperBridge',
  data: {
    title: 'CHPL Compliance Dashboard',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-developer'],
  },
}];

function complianceDashboardStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default complianceDashboardStatesConfig;
