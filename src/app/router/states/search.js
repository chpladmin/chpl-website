import { lazy } from 'react';

import PassthroughView from '../passthrough-view';

const states = [
  {
    name: 'search',
    url: '/search',
    component: lazy(() => import('pages/search/listings/listings-wrapper')),
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
    component: lazy(() => import('pages/search/api-documentation/api-documentation-wrapper')),
    data: { title: 'API Information' },
  }, {
    name: 'shortcut.banned-developers',
    url: '/banned-developers',
    component: lazy(() => import('pages/search/banned-developers/banned-developers-wrapper')),
    data: { title: 'Banned Developers' },
  }, {
    name: 'shortcut.corrective-action',
    url: '/corrective-action',
    component: lazy(() => import('pages/search/corrective-action/corrective-action-wrapper')),
    data: { title: 'Products: Corrective Action Status' },
  }, {
    name: 'shortcut.decertified-products',
    url: '/decertified-products',
    component: lazy(() => import('pages/search/decertified-products/decertified-products-wrapper')),
    data: { title: 'Decertified Products' },
  }, {
    name: 'shortcut.decision-support-interventions',
    url: '/decision-support-interventions',
    component: lazy(() => import('pages/search/decision-support-interventions/decision-support-interventions-wrapper')),
    data: { title: 'Decision Support Interventions' },
  }, {
    name: 'shortcut.inactive-certificates',
    url: '/inactive-certificates',
    component: lazy(() => import('pages/search/inactive-certificates/inactive-certificates-wrapper')),
    data: { title: 'Inactive Certificates' },
  }, {
    name: 'shortcut.real-world-testing',
    url: '/real-world-testing',
    component: lazy(() => import('pages/search/real-world-testing/real-world-testing-wrapper')),
    data: { title: 'Real World Testing' },
  }, {
    name: 'shortcut.sed',
    url: '/sed',
    component: lazy(() => import('pages/search/sed/sed-wrapper')),
    data: { title: 'SED Information' },
  }, {
    name: 'shortcut.svap',
    url: '/svap',
    component: lazy(() => import('pages/search/svap/svap-wrapper')),
    data: { title: 'SVAP Information' },
  },
];

export default states;
