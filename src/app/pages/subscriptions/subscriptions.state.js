const states = [{
  name: 'subscriptions',
  abstract: true,
  url: '/subscriptions',
  template: '<ui-view/>',
}, {
  name: 'subscriptions.confirm',
  url: '/confirm/{hash}',
  component: 'chplConfirmSubscriptionBridge',
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
  name: 'subscriptions.unsubscribe',
  url: '/unsubscribe/{hash}',
  component: 'ChplUnsubscribeAllBridge',
  params: {
    hash: { squash: true, value: null },
  },
  resolve: {
    hash: ($transition$) => {
      'ngInject';

      return $transition$.params().hash;
    },
  },
  data: { title: 'CHPL Subscriptions' },
}, {
  name: 'subscriptions.manage',
  url: '/manage/{hash}',
  component: 'chplManageSubscriptionBridge',
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
