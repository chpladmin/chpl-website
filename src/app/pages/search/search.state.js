const states = [
  {
    name: 'search',
    url: '/search',
    component: 'chplSearchWrapperBridge',
    data: {
      title: 'CHPL Search',
    },
  }, {
    name: 'shortcut',
    abstract: true,
    template: '<ui-view/>',
  }, {
    name: 'shortcut.api-documentation',
    url: '/api-documentation',
    component: 'chplApiDocumentationSearchWrapperBridge',
    data: { title: 'API Information' },
  }, {
    name: 'shortcut.corrective-action',
    url: '/corrective-action',
    component: 'chplCorrectiveActionSearchWrapperBridge',
    data: { title: 'Products: Corrective Action Status' },
  }, {
    name: 'shortcut.developers',
    url: '/developers',
    component: 'chplBannedDevelopersSearchPageBridge',
    data: { title: 'Banned Developers' },
  }, {
    name: 'shortcut.inactive-certificates',
    url: '/inactive',
    component: 'chplInactiveCertificatesSearchWrapperBridge',
    data: { title: 'Inactive Certificates' },
  }, {
    name: 'shortcut.decertified-products',
    url: '/products',
    component: 'chplDecertifiedProductsSearchWrapperBridge',
    data: { title: 'Decertified Products' },
  }, {
    name: 'shortcut.real-world-testing',
    url: '/real-world-testing',
    component: 'chplRealWorldTestingSearchWrapperBridge',
    data: { title: 'Real World Testing' },
  }, {
    name: 'shortcut.sed',
    url: '/sed',
    component: 'chplSedSearchWrapperBridge',
    data: { title: 'SED Information' },
  }, {
    name: 'shortcut.svap',
    url: '/svap',
    component: 'chplSvapSearchWrapperBridge',
    data: { title: 'SVAP Information' },
  },
];

function searchStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}
export default searchStatesConfig;
