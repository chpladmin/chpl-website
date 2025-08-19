const states = [];

function complianceDashboardStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default complianceDashboardStatesConfig;
