const states = [
  {
    name: 'users',
    url: '/users',
    component: 'chplUserManagement',
    resolve: {
      users: (authService, networkService) => {
        'ngInject';

        if (authService.hasAnyRole(['chpl-admin', 'chpl-onc'])) {
          return networkService.getUsers();
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
