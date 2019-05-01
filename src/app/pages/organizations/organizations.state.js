let states = [
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
            developer: (networkService, $transition$) => networkService.getDeveloper($transition$.params().developerId),
            products: (networkService, $transition$) => networkService.getProductsByDeveloper($transition$.params().developerId),
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
            product: (networkService, $transition$) => networkService.getSimpleProduct($transition$.params().productId),
            versions: (networkService, $transition$) => networkService.getVersionsByProduct($transition$.params().productId),
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
            version: (networkService, $transition$) => networkService.getVersion($transition$.params().versionId),
            listings: (networkService, $transition$) => networkService.getProductsByVersion($transition$.params().versionId, false),
        },
        data: { title: 'CHPL Product Versions' },
    },
];

function organizationsStateConfig ($stateProvider) {
    'ngInject'
    states.forEach(state => {
        $stateProvider.state(state);
    });
}

export { organizationsStateConfig, states };
