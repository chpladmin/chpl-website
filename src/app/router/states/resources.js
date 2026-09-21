import { lazy } from 'react';

import PassthroughView from '../passthrough-view';

const states = [
  {
    name: 'resources',
    abstract: true,
    url: '/resources',
    component: PassthroughView,
  }, {
    name: 'resources.api',
    url: '/api',
    component: lazy(() => import('pages/resources/api/api-wrapper')),
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
    component: lazy(() => import('pages/resources/cms-lookup/cms-lookup-wrapper')),
    data: { title: 'CMS ID Reverse Lookup' },
  }, {
    name: 'resources.download',
    url: '/download',
    component: lazy(() => import('pages/resources/download/download-wrapper')),
    data: { title: 'Download the CHPL' },
  }, {
    name: 'resources.overview',
    url: '/overview',
    component: lazy(() => import('pages/resources/overview/overview-wrapper')),
    data: { title: 'CHPL Overview' },
  }, {
    name: 'forgot-password',
    url: '/forgot-password/{uuid}',
    component: lazy(() => import('pages/resources/forgot-password/forgot-password-wrapper')),
    params: {
      uuid: { squash: true, value: null },
    },
    resolve: [
      { token: 'uuid', deps: ['$transition$'], resolveFn: (transition) => transition.params().uuid },
    ],
    data: { title: 'Reset forgotten password' },
  }, {
    // `target` is not in the url: it is a transition-only param, set by the
    // otherwise handler and the error hook, and read at runtime by not-found
    name: 'not-found',
    url: '/not-found',
    params: {
      target: { squash: true, value: null },
    },
    component: lazy(() => import('pages/resources/not-found/not-found')),
    data: { title: 'Error: page not found' },
  },
];

export default states;
