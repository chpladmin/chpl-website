import PassthroughView from '../passthrough-view';

import ChplCmsLookupWrapper from 'pages/resources/cms-lookup/cms-lookup-wrapper';
import ChplForgotPassword from 'pages/resources/forgot-password/forgot-password-wrapper';
import ChplNotFound from 'pages/resources/not-found/not-found';
import ChplResourcesApi from 'pages/resources/api/api-wrapper';
import ChplResourcesDownloadWrapper from 'pages/resources/download/download-wrapper';
import ChplResourcesOverview from 'pages/resources/overview/overview-wrapper';

const states = [
  {
    name: 'resources',
    abstract: true,
    url: '/resources',
    component: PassthroughView,
  }, {
    name: 'resources.api',
    url: '/api',
    component: ChplResourcesApi,
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
    component: ChplCmsLookupWrapper,
    data: { title: 'CMS ID Reverse Lookup' },
  }, {
    name: 'resources.download',
    url: '/download',
    component: ChplResourcesDownloadWrapper,
    data: { title: 'Download the CHPL' },
  }, {
    name: 'resources.overview',
    url: '/overview',
    component: ChplResourcesOverview,
    data: { title: 'CHPL Overview' },
  }, {
    name: 'forgot-password',
    url: '/forgot-password/{uuid}',
    component: ChplForgotPassword,
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
    component: ChplNotFound,
    data: { title: 'Error: page not found' },
  },
];

export default states;
