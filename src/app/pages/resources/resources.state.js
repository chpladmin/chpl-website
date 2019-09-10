function resourcesStateConfig ($stateProvider) {
    'ngInject'
    $stateProvider
        .state('resources', {
            abstract: true,
            url: '/resources',
            template: '<ui-view/>',
        })
        .state('resources.chpl-api', {
            url: '/chpl-api',
            template: require('./chpl-api/chpl-api.html'),
            controller: 'ChplApiController',
            controllerAs: 'vm',
            data: { title: 'CHPL API' },
        })
        .state('resources.chpl_api', { // state is a result of OCD-2964; should be removed when API is updated
            url: '/chpl_api',
            redirectTo: 'resources.chpl-api',
        })
        .state('resources.cms-lookup', {
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

module.exports = resourcesStateConfig;
