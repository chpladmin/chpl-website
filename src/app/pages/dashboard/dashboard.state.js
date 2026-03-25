const states = [{
  name: 'dashboard',
  url: '/dashboard',
  component: 'chplDashboardBridge',
  data: {
    title: 'ASTP Compliance Dashboard',
    roles: ['chpl-admin'],
  },
}];

function dashboardStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default dashboardStatesConfig;
