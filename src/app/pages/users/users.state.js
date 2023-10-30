const states = [
  {
    name: 'users',
    url: '/users',
    component: 'chplUserManagement',
    resolve: {
      users: (authService, networkService) => {
        'ngInject';

        if (authService.hasAnyRole(['CHPL-ADMIN', 'ROLE_ONC'])) {
          return networkService.getUsers();
        }
        return [];
      },
    },
    data: {
      title: 'CHPL Users',
      roles: ['CHPL-ADMIN', 'ROLE_ONC'],
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
