import PassthroughView from '../passthrough-view';

import ChplApiKeyConfirmWrapper from 'pages/registration/api-key-confirm-wrapper';
import ChplRegisterUser from 'pages/registration/register-user-wrapper';

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
  component: ChplRegisterUser,
  params: {
    hash: { squash: true, value: null },
  },
  resolve: hashResolve,
  data: { title: 'CHPL Registration' },
}, {
  name: 'registration.api-key',
  url: '/api-key/{hash}',
  component: ChplApiKeyConfirmWrapper,
  params: {
    hash: { squash: true, value: null },
  },
  resolve: hashResolve,
  data: { title: 'CHPL Registration' },
}];

export default states;
