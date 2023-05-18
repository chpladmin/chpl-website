const states = [
  {
    name: 'search',
    url: '/search',
    component: 'chplSearchWrapperBridge',
    data: {
      title: 'CHPL Search',
    },
  }, {
    name: 'collections',
    abstract: true,
    url: '/collections',
    template: '<ui-view/>',
  }, {
    name: 'collections.api-documentation',
    url: '/api-documentation',
    component: 'chplApiDocumentationCollectionWrapperBridge',
    data: { title: 'API Information for 2015 Edition Products' },
  }, {
    name: 'collections.corrective-action',
    url: '/corrective-action',
    component: 'chplCorrectiveActionCollectionWrapperBridge',
    data: { title: 'Products: Corrective Action Status' },
  }, {
    name: 'collections.developers',
    url: '/developers',
    component: 'chplBannedDevelopersCollectionPageBridge',
    data: { title: 'Banned Developers' },
  }, {
    name: 'collections.inactive-certificates',
    url: '/inactive',
    component: 'chplInactiveCertificatesCollectionWrapperBridge',
    data: { title: 'Inactive Certificates' },
  }, {
    name: 'collections.decertified-products',
    url: '/products',
    component: 'chplDecertifiedProductsCollectionWrapperBridge',
    data: { title: 'Decertified Products' },
  }, {
    name: 'collections.real-world-testing',
    url: '/real-world-testing',
    component: 'chplRealWorldTestingCollectionWrapperBridge',
    data: { title: 'Real World Testing' },
  }, {
    name: 'collections.sed',
    url: '/sed',
    component: 'chplSedCollectionWrapperBridge',
    data: { title: 'SED Information for 2015 Edition Products' },
  }, {
    name: 'collections.svap',
    url: '/svap',
    component: 'chplSvapCollectionWrapperBridge',
    data: { title: 'SVAP Information' },
  },
];

function collectionsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}
export default collectionsStatesConfig;
