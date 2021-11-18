/* eslint-disable global-require */
const states = [
  {
    name: 'collections',
    abstract: true,
    url: '/collections',
    template: '<ui-view/>',
  }, {
    name: 'collections.api-documentation',
    url: '/api-documentation',
    controller: 'ApiDocumentationController',
    controllerAs: 'vm',
    template: require('./api-documentation/api-documentation.html'),
    data: { title: 'API Information for 2015 Edition Products' },
  }, {
    name: 'collections.corrective-action',
    url: '/corrective-action',
    controller: 'CorrectiveActionController',
    controllerAs: 'vm',
    template: require('./corrective-action/corrective-action.html'),
    data: { title: 'Products: Corrective Action Status' },
  }, {
    name: 'collections.developers',
    url: '/developers',
    controller: 'BannedDevelopersController',
    controllerAs: 'vm',
    template: require('./developers/developers.html'),
    data: { title: 'Banned Developers' },
  }, {
    name: 'collections.inactive',
    url: '/inactive',
    controller: 'InactiveCertificatesController',
    controllerAs: 'vm',
    template: require('./inactive/inactive.html'),
    data: { title: 'Inactive Certificates' },
  }, {
    name: 'collections.products',
    url: '/products',
    controller: 'DecertifiedProductsController',
    controllerAs: 'vm',
    template: require('./products/products.html'),
    data: { title: 'Decertified Products' },
  }, {
    name: 'collections.real-world-testing',
    url: '/real-world-testing',
    component: 'chplRealWorldTestingCollectionPageWrapperBridge',
    data: { title: 'Real World Testing' },
  }, {
    name: 'collections.sed',
    url: '/sed',
    controller: 'SedCollectionController',
    controllerAs: 'vm',
    template: require('./sed/sed.html'),
    data: { title: 'SED Information for 2015 Edition Products' },
  },
];

function collectionsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}
export default collectionsStatesConfig;
