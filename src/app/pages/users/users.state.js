let states = [
  {
    name: 'users',
    url: '/users',
    component: 'chplUserManagement',
    resolve: {
      users: (authService, networkService) => {
        'ngInject';
        if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'])) {
          return networkService.getUsers();
        } else {
          return [];
        }
      },
    },
    data: {
      title: 'CHPL Users',
      roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'],
    },
  },
];

function usersStatesConfig ($stateProvider) {
  'ngInject';
  states.forEach(state => {
    $stateProvider.state(state);
  });
}

export { usersStatesConfig };
