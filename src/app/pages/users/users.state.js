const states = [
  {
    name: 'users',
    url: '/users',
    component: 'chplUserManagement',
    resolve: {
      users: (authService, featureFlags, networkService) => {
        'ngInject';

        if (authService.hasAnyRole(['chpl-admin', 'chpl-onc'])) {
          console.log(featureFlags.isOn);
          if (featureFlags.isOn('sso')) {
            console.log('Getting Cognito Users');
            return networkService.getCognitoUsers();
          } else {
            console.log('Getting CHPL Users');
            return networkService.getUsers();
          }
        }
        return [];
      },
    },
    data: {
      title: 'CHPL Users',
      roles: ['chpl-admin', 'chpl-onc'],
    },
  },
];

function usersStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default usersStatesConfig;
