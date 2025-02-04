const states = [{
  name: 'charts',
  url: '/charts',
  component: 'chplChartsBridge',
  data: { title: 'CHPL Charts' },
}];

function chartsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default chartsStatesConfig;
