const states = [
  {
    name: 'compare',
    url: '/compare/{ids}',
    component: 'chplComparePageBridge',
    params: {
      ids: { squash: true, value: null },
    },
    resolve: {
      ids: ($transition$) => {
        'ngInject';

        return $transition$.params().ids;
      },
    },
    data: { title: 'CHPL Product Comparison' },
  },
];

function compareStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default compareStatesConfig;
