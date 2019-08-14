let states = {
    'role-developer': [
        {
            name: 'dashboard',
            url: '/dashboard',
            component: 'chplDashboard',
            resolve: {
                developerId: (authService, networkService) => {
                    'ngInject'
                    let username = authService.getUsername();
                    if (username) {
                        return networkService.getUserByUsername(username).organizationId || 448; // hard coded dev id until organizationId exists
                    }
                },
            },
            data: { title: 'CHPL Dashboard' },
            ncyBreadcrumb: {
                label: 'Dashboard',
            },
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
