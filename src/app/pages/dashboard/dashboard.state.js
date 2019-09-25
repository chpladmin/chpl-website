let states = {
    'role-developer': [
        {
            name: 'dashboard',
            url: '/dashboard',
            component: 'chplDashboard',
            resolve: {
                developerId: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole(['ROLE_DEVELOPER'])) {
                        if (authService.getCurrentUser()) {
                            return authService.getCurrentUser().organizations[0].id;
                        } else {
                            return networkService.getUserByUsername(authService.getUsername())
                                .then(user => {
                                    authService.saveCurrentUser(user);
                                    return user.organizations[0].id;
                                });
                        }
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
