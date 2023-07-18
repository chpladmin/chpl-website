const states = [{
  name: 'subscriptions',
  abstract: true,
  url: '/subscriptions',
  template: '<ui-view/>',
}, {
  name: 'subscriptions.confirm',
  url: '/confirm/{hash}',
  component: 'chplSubscriptionsConfirmSubscription',
  params: {
    hash: { squash: true, value: null },
  },
  data: { title: 'CHPL Subscriptions' },
  resolve: {
    hash: ($transition$) => {
      'ngInject';

      return $transition$.params().hash;
    },
  },
}, {
  name: 'subscriptions.manage',
  url: '/manage/{hash}',
  component: 'chplSubscriptionsManageSubscription',
  params: {
    hash: { squash: true, value: null },
  },
  data: { title: 'CHPL Subscriptions' },
  resolve: {
    hash: ($transition$) => {
      'ngInject';

      return $transition$.params().hash;
    },
  },
}];

function subscriptionsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default subscriptionsStatesConfig;
