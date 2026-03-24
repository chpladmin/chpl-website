const states = [{
  name: 'dashboard',
  url: '/dashboard',
  component: 'chplDashboardBridge',
  data: { title: 'ASTP Compliance Dashboard' },
}];

function dashboardStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default dashboardStatesConfig;
