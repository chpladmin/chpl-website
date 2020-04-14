let states = [
    {
        name: 'resources',
        abstract: true,
        url: '/resources',
        template: '<ui-view/>',
    },{
        name: 'resources.chpl-api',
        url: '/chpl-api',
        template: require('./chpl-api/chpl-api.html'),
        controller: 'ChplApiController',
        controllerAs: 'vm',
        data: { title: 'CHPL API' },
    },{
        name: 'resources.chpl_api', // state is a result of OCD-2964; should be removed when API is updated
        url: '/chpl_api',
        redirectTo: 'resources.chpl-api',
    },{
        name: 'resources.cms-lookup',
        url: '/cms-lookup',
        template: require('./cms-lookup/cms-lookup.html'),
        controller: 'CmsLookupController',
        controllerAs: 'vm',
        data: { title: 'CMS ID Reverse Lookup' },
    },{
        name: 'resources.download',
        url: '/download',
        component: 'aiResourcesDownload',
        data: { title: 'Download the CHPL' },
    },{
        name: 'resources.overview',
        url: '/overview',
        component: 'aiOverview',
        data: { title: 'CHPL Overview' },
    },
];

function resourcesStatesConfig ($stateProvider) {
    'ngInject'
    states.forEach(state => {
        $stateProvider.state(state);
    });
}

export { resourcesStatesConfig }
