import PassthroughView from '../passthrough-view';

import ChplApiDocumentationSearchWrapper from 'pages/search/api-documentation/api-documentation-wrapper';
import ChplBannedDevelopersSearchWrapper from 'pages/search/banned-developers/banned-developers-wrapper';
import ChplCorrectiveActionSearchWrapper from 'pages/search/corrective-action/corrective-action-wrapper';
import ChplDecertifiedProductsSearchWrapper from 'pages/search/decertified-products/decertified-products-wrapper';
import ChplDecisionSupportInterventionsSearchWrapper from 'pages/search/decision-support-interventions/decision-support-interventions-wrapper';
import ChplInactiveCertificatesSearchWrapper from 'pages/search/inactive-certificates/inactive-certificates-wrapper';
import ChplListingsSearchWrapper from 'pages/search/listings/listings-wrapper';
import ChplRealWorldTestingSearchWrapper from 'pages/search/real-world-testing/real-world-testing-wrapper';
import ChplSedSearchWrapper from 'pages/search/sed/sed-wrapper';
import ChplSvapSearchWrapper from 'pages/search/svap/svap-wrapper';

const states = [
  {
    name: 'search',
    url: '/search',
    component: ChplListingsSearchWrapper,
    data: {
      title: 'CHPL Search',
    },
  }, {
    // namespacing only: no url of its own, children carry root-level urls
    name: 'shortcut',
    abstract: true,
    component: PassthroughView,
  }, {
    name: 'shortcut.api-documentation',
    url: '/api-documentation',
    component: ChplApiDocumentationSearchWrapper,
    data: { title: 'API Information' },
  }, {
    name: 'shortcut.banned-developers',
    url: '/banned-developers',
    component: ChplBannedDevelopersSearchWrapper,
    data: { title: 'Banned Developers' },
  }, {
    name: 'shortcut.corrective-action',
    url: '/corrective-action',
    component: ChplCorrectiveActionSearchWrapper,
    data: { title: 'Products: Corrective Action Status' },
  }, {
    name: 'shortcut.decertified-products',
    url: '/decertified-products',
    component: ChplDecertifiedProductsSearchWrapper,
    data: { title: 'Decertified Products' },
  }, {
    name: 'shortcut.decision-support-interventions',
    url: '/decision-support-interventions',
    component: ChplDecisionSupportInterventionsSearchWrapper,
    data: { title: 'Decision Support Interventions' },
  }, {
    name: 'shortcut.inactive-certificates',
    url: '/inactive-certificates',
    component: ChplInactiveCertificatesSearchWrapper,
    data: { title: 'Inactive Certificates' },
  }, {
    name: 'shortcut.real-world-testing',
    url: '/real-world-testing',
    component: ChplRealWorldTestingSearchWrapper,
    data: { title: 'Real World Testing' },
  }, {
    name: 'shortcut.sed',
    url: '/sed',
    component: ChplSedSearchWrapper,
    data: { title: 'SED Information' },
  }, {
    name: 'shortcut.svap',
    url: '/svap',
    component: ChplSvapSearchWrapper,
    data: { title: 'SVAP Information' },
  },
];

export default states;
