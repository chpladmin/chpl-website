import PassthroughView from '../passthrough-view';

import ChplConfirmSubscription from 'pages/subscriptions/confirm-subscription-wrapper';
import ChplManageSubscription from 'pages/subscriptions/manage-subscription-wrapper';
import ChplUnsubscribeAll from 'pages/subscriptions/unsubscribe-all-wrapper';

const hashResolve = [
  { token: 'hash', deps: ['$transition$'], resolveFn: (transition) => transition.params().hash },
];

const states = [{
  name: 'subscriptions',
  abstract: true,
  url: '/subscriptions',
  component: PassthroughView,
}, {
  name: 'subscriptions.confirm',
  url: '/confirm/{hash}',
  component: ChplConfirmSubscription,
  params: {
    hash: { squash: true, value: null },
  },
  data: { title: 'CHPL Subscriptions' },
  resolve: hashResolve,
}, {
  name: 'subscriptions.unsubscribe',
  url: '/unsubscribe/{hash}',
  component: ChplUnsubscribeAll,
  params: {
    hash: { squash: true, value: null },
  },
  resolve: hashResolve,
  data: { title: 'CHPL Subscriptions' },
}, {
  name: 'subscriptions.manage',
  url: '/manage/{hash}',
  component: ChplManageSubscription,
  params: {
    hash: { squash: true, value: null },
  },
  data: { title: 'CHPL Subscriptions' },
  resolve: hashResolve,
}];

export default states;
