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
        },{
            name: 'organizations.onc-acbs',
            url: '/onc-acbs/{oncAcbId}?',
            component: 'chplOncAcbs',
            params: {
                oncAcbId: {squash: true, value: null},
            },
            resolve: {
                acb: (networkService, $transition$) => {
                    'ngInject'
                    if ($transition$.params().oncAcbId) {
                        return networkService.getAcb($transition$.params().oncAcbId);
                    }
                    return {};
                },
                acbs: (authService, networkService) => {
                    'ngInject'
                    return networkService.getAcbs(authService.hasAnyRole());
                },
            },
            data: { title: 'CHPL ONC-ACBs' },
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
        },{
            name: 'organizations.onc-acbs',
            url: '/onc-acbs',
            template: '<div>><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL ONC-ACBs' },
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
