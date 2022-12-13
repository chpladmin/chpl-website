const states = [
  {
    name: 'resources',
    abstract: true,
    url: '/resources',
    template: '<ui-view/>',
  }, {
    name: 'resources.api',
    url: '/api',
    component: 'chplResourcesApiBridge',
    data: { title: 'CHPL API' },
  }, {
    name: 'resources.chpl-api',
    url: '/chpl-api',
    redirectTo: 'resources.api',
  }, {
    name: 'resources.chpl_api', // state is a result of OCD-2964; should be removed when API is updated
    url: '/chpl_api',
    redirectTo: 'resources.api',
  }, {
    name: 'resources.cms-lookup',
    url: '/cms-lookup',
    component: 'chplCmsLookupWrapperBridge',
    data: { title: 'CMS ID Reverse Lookup' },
  }, {
    name: 'resources.download',
    url: '/download',
    component: 'chplResourcesDownloadWrapperBridge',
    data: { title: 'Download the CHPL' },
  }, {
    name: 'resources.overview',
    url: '/overview',
    component: 'chplResourcesOverviewBridge',
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
