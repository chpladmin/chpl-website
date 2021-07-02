const states = [
  {
    name: 'resources',
    abstract: true,
    url: '/resources',
    template: '<ui-view/>',
  }, {
    name: 'resources.chpl-api',
    url: '/chpl-api',
    template: require('./chpl-api/chpl-api.html'), // eslint-disable-line global-require
    controller: 'ChplApiController',
    controllerAs: 'vm',
    data: { title: 'CHPL API' },
  }, {
    name: 'resources.chpl_api', // state is a result of OCD-2964; should be removed when API is updated
    url: '/chpl_api',
    redirectTo: 'resources.chpl-api',
  }, {
    name: 'resources.cms-lookup',
    url: '/cms-lookup',
    template: require('./cms-lookup/cms-lookup.html'), // eslint-disable-line global-require
    controller: 'CmsLookupController',
    controllerAs: 'vm',
    data: { title: 'CMS ID Reverse Lookup' },
  }, {
    name: 'resources.download',
    url: '/download',
    component: 'chplResourcesDownload',
    data: { title: 'Download the CHPL' },
  }, {
    name: 'resources.overview',
    url: '/overview',
    component: 'aiOverview',
    data: { title: 'CHPL Overview' },
  }, {
    name: 'not-found',
    url: '/not-found',
    params: {
      target: { squash: true, value: null },
    },
    component: 'chplNotFoundBridge',
    data: { title: 'Error: page not found' },
  }, {
    name: 'style-guide',
    url: '/style-guide',
    component: 'chplStyleGuideBridge',
    data: {
      title: 'CHPL Style Guide',
      roles: ['ROLE_ADMIN'],
    },
  },
];

function resourcesStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default resourcesStatesConfig;
