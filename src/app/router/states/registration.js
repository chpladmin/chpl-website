import { lazy } from 'react';

import PassthroughView from '../passthrough-view';

const hashResolve = [
  { token: 'hash', deps: ['$transition$'], resolveFn: (transition) => transition.params().hash },
];

const states = [{
  name: 'registration',
  abstract: true,
  url: '/registration',
  component: PassthroughView,
}, {
  name: 'registration.create-user',
  url: '/create-user/{hash}',
  component: lazy(() => import('pages/registration/register-user')),
  params: {
    hash: { squash: true, value: null },
  },
  resolve: hashResolve,
  data: { title: 'CHPL Registration' },
}, {
  name: 'registration.api-key',
  url: '/api-key/{hash}',
  component: lazy(() => import('components/api-key/api-key-confirm')),
  params: {
    hash: { squash: true, value: null },
  },
  resolve: hashResolve,
  data: { title: 'CHPL Registration' },
}];

export default states;
