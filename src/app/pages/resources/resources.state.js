function stateConfig ($stateProvider) {
    $stateProvider
        .state('resources', {
            abstract: true,
            url: '/resources',
            template: '<ui-view/>',
        })
        .state('resources.chpl_api', {
            url: '/chpl-api',
            template: require('./chpl-api/chpl-api.html'),
            controller: 'ChplApiController',
            controllerAs: 'vm',
            data: { title: 'CHPL API' },
        })
        .state('resources.cms_lookup', {
            url: '/cms-lookup',
            template: require('./cms-lookup/cms-lookup.html'),
            controller: 'CmsLookupController',
            controllerAs: 'vm',
            data: { title: 'CMS ID Reverse Lookup' },
        })
        .state('resources.download', {
            url: '/download',
            component: 'aiResourcesDownload',
            data: { title: 'Download the CHPL' },
        })
        .state('resources.overview', {
            url: '/overview',
            component: 'aiOverview',
            data: { title: 'CHPL Overview' },
        });
}

module.exports = stateConfig;
