import { lazy } from 'react';

import PassthroughView from '../passthrough-view';

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
  component: lazy(() => import('pages/subscriptions/confirm-subscription-wrapper')),
  params: {
    hash: { squash: true, value: null },
  },
  data: { title: 'CHPL Subscriptions' },
  resolve: hashResolve,
}, {
  name: 'subscriptions.unsubscribe',
  url: '/unsubscribe/{hash}',
  component: lazy(() => import('pages/subscriptions/unsubscribe-all-wrapper')),
  params: {
    hash: { squash: true, value: null },
  },
  resolve: hashResolve,
  data: { title: 'CHPL Subscriptions' },
}, {
  name: 'subscriptions.manage',
  url: '/manage/{hash}',
  component: lazy(() => import('pages/subscriptions/manage-subscription-wrapper')),
  params: {
    hash: { squash: true, value: null },
  },
  data: { title: 'CHPL Subscriptions' },
  resolve: hashResolve,
}];

export default states;
