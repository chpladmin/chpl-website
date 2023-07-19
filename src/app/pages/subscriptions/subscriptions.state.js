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
  resolve: {
    hash: ($transition$) => {
      'ngInject';

      return $transition$.params().hash;
    },
  },
  data: { title: 'CHPL Subscriptions' },
}, {
  name: 'subscriptions.unsubscribe',
  url: '/unsubscribe/{hash}',
  component: 'chplSubscriptionsUnsubscribeAll',
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
  component: 'chplSubscriptionsManageSubscription',
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
}];

function subscriptionsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default subscriptionsStatesConfig;
