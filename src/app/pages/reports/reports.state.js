function reportsStateConfig ($stateProvider) {
    'ngInject'
    $stateProvider
        .state('reports', {
            abstract: true,
            url: '/reports',
            template: '<div class="container-fluid"><div class="row"><div class="col-sm-12"><h1>CHPL Reports</h1></div></div><div class="main-content" id="main-content" tabindex="-1"><ui-view/></div></div>',
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
        .state('reports.versions', {
            url: '/versions',
            component: 'chplReportsVersions',
            data: { title: 'CHPL Reports - Versions' },
        });
}

module.exports = reportsStateConfig;
