let states = {
    'enabled': [
        {
            name: 'organizations',
            abstract: true,
            url: '/organizations',
            component: 'chplOrganizations',
            ncyBreadcrumb: {
                label: 'Organizations',
            },
        },{
            name: 'organizations.developers',
            url: '/developers/{developerId}/{action}?',
            component: 'chplDevelopers',
            params: {
                developerId: {squash: true, value: null},
                action: {squash: true, value: null},
            },
            resolve: {
                developer: (networkService, $transition$) => {
                    'ngInject'
                    if ($transition$.params().developerId) {
                        return networkService.getDeveloper($transition$.params().developerId);
                    }
                    return {};
                },
                developers: networkService => {
                    'ngInject'
                    return networkService.getDevelopers();
                },
                products: (networkService, $transition$) => {
                    'ngInject'
                    if ($transition$.params().developerId) {
                        return networkService.getProductsByDeveloper($transition$.params().developerId);
                    }
                    return {};
                },
            },
            data: { title: 'CHPL Developers' },
            ncyBreadcrumb: {
                label: 'Developer',
            },
        },{
            name: 'organizations.developers.products',
            url: '/products/{productId}/{action}?',
            component: 'chplProducts',
            params: {
                action: {squash: true, value: null},
            },
            resolve: {
                product: (networkService, $transition$) => {
                    'ngInject'
                    return networkService.getSimpleProduct($transition$.params().productId);
                },
                versions: (networkService, $transition$) => {
                    'ngInject'
                    return networkService.getVersionsByProduct($transition$.params().productId);
                },
            },
            data: { title: 'CHPL Products' },
            ncyBreadcrumb: {
                label: 'Product',
            },
        },{
            name: 'organizations.developers.products.versions',
            url: '/versions/{versionId}/{action}?',
            component: 'chplVersions',
            params: {
                action: {squash: true, value: null},
            },
            resolve: {
                version: (networkService, $transition$) => {
                    'ngInject'
                    return networkService.getVersion($transition$.params().versionId);
                },
                listings: (networkService, $transition$) => {
                    'ngInject'
                    return networkService.getProductsByVersion($transition$.params().versionId, false);
                },
            },
            data: { title: 'CHPL Product Versions' },
            ncyBreadcrumb: {
                label: 'Version',
            },
        },{
            name: 'organizations.onc-acbs',
            url: '/onc-acbs',
            component: 'chplOncOrganizations',
            resolve: {
                allOrgs: (authService, networkService) => {
                    'ngInject'
                    return networkService.getAcbs(false);
                },
                editableOrgs: (authService, networkService) => {
                    'ngInject'
                    return networkService.getAcbs(true);
                },
                roles: () => ['ROLE_ACB'],
                key: () => 'acbs',
                type: () => 'ONC-ACB',
                functions: () => ({
                    get: 'getAcbs',
                    getUsers: 'getUsersAtAcb',
                    modify: 'modifyACB',
                    create: 'createACB',
                    removeUser: 'removeUserFromAcb',
                }),
            },
            data: { title: 'CHPL ONC-ACBs' },
            ncyBreadcrumb: {
                label: 'ONC-ACBs',
            },
        },{
            name: 'organizations.onc-acbs.organization',
            url: '/{id}',
            component: 'chplOncOrganization',
            resolve: {
                organization: ($transition$, networkService) => {
                    'ngInject'
                    return networkService.getAcb($transition$.params().id);
                },
            },
            data: { title: 'CHPL ONC-ACB' },
            ncyBreadcrumb: {
                label: '{{ $resolve.organization.name }}',
            },
        },{
            name: 'organizations.onc-atls',
            url: '/onc-atls',
            component: 'chplOncOrganizations',
            resolve: {
                allOrgs: (authService, networkService) => {
                    'ngInject'
                    return networkService.getAtls(false);
                },
                editableOrgs: (authService, networkService) => {
                    'ngInject'
                    return networkService.getAtls(true);
                },
                roles: () => ['ROLE_ATL'],
                key: () => 'atls',
                type: () => 'ONC-ATL',
                functions: () => ({
                    get: 'getAtls',
                    getUsers: 'getUsersAtAtl',
                    modify: 'modifyATL',
                    create: 'createATL',
                    removeUser: 'removeUserFromAtl',
                }),
            },
            data: { title: 'CHPL ONC-ATLs' },
            ncyBreadcrumb: {
                label: 'ONC-ATLs',
            },
        },{
            name: 'organizations.onc-atls.organization',
            url: '/{id}',
            component: 'chplOncOrganization',
            resolve: {
                organization: ($transition$, networkService) => {
                    'ngInject'
                    return networkService.getAtl($transition$.params().id);
                },
            },
            data: { title: 'CHPL ONC-ATL' },
            ncyBreadcrumb: {
                label: '{{ $resolve.organization.name }}',
            },
        },
    ],
    'base': [
        {
            name: 'organizations',
            abstract: true,
            url: '/organizations',
            template: '<ui-view />',
        },{
            name: 'organizations.developers',
            url: '/developers/{developerId}/{action}?',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Developers' },
        },{
            name: 'organizations.developers.products',
            url: '/products/{productId}/{action}?',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Products' },
        },{
            name: 'organizations.developers.products.versions',
            url: '/versions/{versionId}/{action}?',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Product Versions' },
        },{
            name: 'organizations.onc-acbs',
            url: '/onc-acbs',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            params: {
                oncAcbId: {squash: true, value: null},
            },
            data: { title: 'CHPL ONC-ACBs' },
        },{
            name: 'organizations.onc-atls',
            url: '/onc-atls',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            params: {
                oncAtlId: {squash: true, value: null},
            },
            data: { title: 'CHPL ONC-ATLs' },
        },
    ],
};

function organizationsStatesConfig ($stateProvider) {
    'ngInject'
    states['base'].forEach(state => {
        $stateProvider.state(state);
    });
}

export { organizationsStatesConfig, states };
