let states = [
    {
        name: 'users',
        url: '/users',
        component: 'chplUserManagement',
        resolve: {
            users: (authService, networkService) => {
                'ngInject'
                if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                    return networkService.getUsers();
                } else {
                    return [];
                }
            },
        },
        data: { title: 'CHPL Users' },
    },
];

function usersStatesConfig ($stateProvider) {
    'ngInject'
    states.forEach(state => {
        $stateProvider.state(state);
    });
}

export { usersStatesConfig };
