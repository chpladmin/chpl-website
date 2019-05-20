function reportsStateConfig ($stateProvider) {
    'ngInject'
    $stateProvider
        .state('reports', {
            abstract: true,
            url: '/reports',
            component: 'chplReports',
            data: { title: 'CHPL Reports' },
        })
        .state('reports.acbs', {
            url: '/onc-acbs',
            component: 'chplReportsAcbs',
            data: { title: 'CHPL Reports - ONC-ACBs' },
        })
        .state('reports.atls', {
            url: '/onc-atls',
            component: 'chplReportsAtls',
            data: { title: 'CHPL Reports - ONC-ATLs' },
        })
        .state('reports.listings', {
            url: '/listings/{productId}?',
            component: 'chplReportsListings',
            params: {
                productId: {squash: true, value: null},
            },
            resolve: {
                productId: $transition$ => $transition$.params().productId,
            },
            data: { title: 'CHPL Reports - Listings' },
        })
        .state('reports.developers', {
            url: '/developers',
            component: 'chplReportsDevelopers',
            data: { title: 'CHPL Reports - Developers' },
        })
        .state('reports.products', {
            url: '/products',
            component: 'chplReportsProducts',
            data: { title: 'CHPL Reports - Products' },
        })
        .state('reports.userActions', {
            url: '/user-actions',
            component: 'chplReportsUserActions',
            data: { title: 'CHPL Reports - User Actions' },
        })
        .state('reports.users', {
            url: '/users',
            component: 'chplReportsUsers',
            data: { title: 'CHPL Reports - Users' },
        })
        .state('reports.versions', {
            url: '/versions',
            component: 'chplReportsVersions',
            data: { title: 'CHPL Reports - Versions' },
        });
}

module.exports = reportsStateConfig;
