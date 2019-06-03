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
        .state('reports.announcements', {
            url: '/announcements',
            component: 'chplReportsAnnouncements',
            data: { title: 'CHPL Reports - Announcements' },
        })
        .state('reports.api-keys', {
            url: '/api-keys',
            component: 'chplReportsApiKeys',
            data: { title: 'CHPL Reports - Api Key Management' },
        })
        .state('reports.api-key-usage', {
            url: '/api-key-usage',
            component: 'chplReportsApiKeyUsage',
            data: { title: 'CHPL Reports - Api Key Usage' },
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
                filterToApply: {squash: true, value: null},
            },
            resolve: {
                productId: $transition$ => $transition$.params().productId,
                filterToApply: $transition$ => $transition$.params().filterToApply,
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
        .state('reports.versions', {
            url: '/versions',
            component: 'chplReportsVersions',
            data: { title: 'CHPL Reports - Versions' },
        });
}

module.exports = reportsStateConfig;
