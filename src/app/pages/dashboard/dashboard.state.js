let states = {
    'role-developer': [
        {
            name: 'dashboard',
            url: '/dashboard',
            component: 'chplDashboard',
            resolve: {
                developer: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole()) {
                        //return networkService.getDeveloper(networkService.getUserByUsername(authService.getUsername()).organizationId);
                        return networkService.getDeveloper(222);
                    } else {
                        return {};
                    }
                },
                users: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole()) {
                        return networkService.getUsers();
                    } else {
                        return [];
                    }
                },
            },
            data: { title: 'CHPL Dashboard' },
        },
    ],
    'base': [
        {
            name: 'dashboard',
            url: '/dashboard',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Dashboard' },
        },
    ],
}

function dashboardStatesConfig ($stateProvider) {
    'ngInject'
    states['base'].forEach(state => {
        $stateProvider.state(state);
    });
}

export { dashboardStatesConfig, states };
