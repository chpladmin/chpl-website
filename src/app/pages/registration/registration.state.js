const states = [{
  name: 'registration',
  abstract: true,
  url: '/registration',
  template: '<ui-view/>',
}, {
  name: 'registration.create-user',
  url: '/create-user/{hash}',
  component: 'chplRegisterUserBridge',
  params: {
    hash: { squash: true, value: null },
  },
  resolve: {
    hash: ($transition$) => {
      'ngInject';

      return $transition$.params().hash;
    },
  },
  data: { title: 'CHPL Registration' },
}, {
  name: 'registration.confirm-user',
  url: '/confirm-user/{hash}',
  component: 'chplRegistrationConfirmUser',
  params: {
    hash: { squash: true, value: null },
  },
  resolve: {
    hash: ($transition$) => {
      'ngInject';

      return $transition$.params().hash;
    },
  },
  data: { title: 'CHPL Registration' },
}, {
  name: 'registration.api-key',
  url: '/api-key/{hash}',
  component: 'chplConfirmApiKeyPage',
  params: {
    hash: { squash: true, value: null },
  },
  resolve: {
    hash: ($transition$) => {
      'ngInject';

      return $transition$.params().hash;
    },
  },
  data: { title: 'CHPL Registration' },
}];

function registrationStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export { registrationStatesConfig }; // eslint-disable-line import/prefer-default-export
