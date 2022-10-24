import ChplApiDocumentationCollectionWrapper from './api-documentation/api-documentation-wrapper';
import ChplBannedDevelopersCollectionPage from './banned-developers/banned-developers';
import ChplDecertifiedProductsCollectionWrapper from './decertified-products/decertified-products-wrapper';
import ChplRealWorldTestingCollectionWrapper from './real-world-testing/real-world-testing-wrapper';

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
    component: ChplApiDocumentationCollectionWrapper,
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
    component: ChplBannedDevelopersCollectionPage,
    data: { title: 'Banned Developers' },
  }, {
    name: 'collections.inactive',
    url: '/inactive',
    controller: 'InactiveCertificatesController',
    controllerAs: 'vm',
    template: require('./inactive/inactive.html'),
    data: { title: 'Inactive Certificates' },
  }, {
    name: 'collections.decertified-products',
    url: '/products',
    component: ChplDecertifiedProductsCollectionWrapper,
    data: { title: 'Decertified Products' },
  }, {
    name: 'collections.sed',
    url: '/sed',
    controller: 'SedCollectionController',
    controllerAs: 'vm',
    template: require('./sed/sed.html'),
    data: { title: 'SED Information for 2015 Edition Products' },
  }, {
    name: 'collections.real-world-testing',
    url: '/real-world-testing',
    component: ChplRealWorldTestingCollectionWrapper,
    data: { title: 'Real World Testing' },
  },
];

function collectionsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}
export default collectionsStatesConfig;
