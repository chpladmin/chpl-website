let states = {
    'ocd2749-on': [
        {
            name: 'users',
            url: '/users',
            component: 'chplUserManagement',
            resolve: {
                users: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole()) {
                        return networkService.getUsers();
                    } else {
                        return [];
                    }
                },
            },
            data: { title: 'CHPL Users' },
        },
    ],
    'base': [
        {
            name: 'users',
            url: '/users',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Users' },
        },
    ],
}

function usersStatesConfig ($stateProvider) {
    'ngInject'
    states['base'].forEach(state => {
        $stateProvider.state(state);
    });
}

export { usersStatesConfig, states };
