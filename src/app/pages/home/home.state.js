const states = [
  {
    name: 'home',
    url: '/home',
    component: 'chplHomeWrapperBridge',
    data: {
      title: 'CHPL Home',
    },
  },
];

function homeStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default homeStatesConfig;
