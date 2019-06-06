let states = {
    'enabled': [
        {
            name: 'organizations',
            abstract: true,
            url: '/organizations',
            template: '<ui-view />',
        },{
            name: 'organizations.developers',
            url: '/developers/{developerId}/{action}?',
            component: 'chplDevelopers',
            params: {
                action: {squash: true, value: null},
            },
            resolve: {
                developer: (networkService, $transition$) => {
                    'ngInject'
                    return networkService.getDeveloper($transition$.params().developerId);
                },
                products: (networkService, $transition$) => {
                    'ngInject'
                    return networkService.getProductsByDeveloper($transition$.params().developerId);
                },
            },
            data: { title: 'CHPL Developers' },
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
            template: '<div>><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Developers' },
        },{
            name: 'organizations.developers.products',
            url: '/products/{productId}/{action}?',
            template: '<div>><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Products' },
        },{
            name: 'organizations.developers.products.versions',
            url: '/versions/{versionId}/{action}?',
            template: '<div>><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Product Versions' },
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
