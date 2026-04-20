const states = [
  {
    name: 'users',
    url: '/users',
    component: 'chplUsersPageBridge',
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
