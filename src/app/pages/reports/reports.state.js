const states = [{
  name: 'reports',
  abstract: true,
  url: '/reports',
  component: 'chplReports',
  data: {
    title: 'CHPL Reports',
    roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'],
  },
}, {
  name: 'reports.acbs',
  url: '/onc-acbs',
  component: 'chplReportsAcbs',
  data: { title: 'CHPL Reports - ONC-ACBs' },
}, {
  name: 'reports.announcements',
  url: '/announcements',
  component: 'chplReportsAnnouncements',
  data: {
    title: 'CHPL Reports - Announcements',
    roles: ['ROLE_ADMIN', 'ROLE_ONC'],
  },
}, {
  name: 'reports.api-keys',
  url: '/api-keys',
  component: 'chplReportsApiKeys',
  data: {
    title: 'CHPL Reports - Api Key Management',
    roles: ['ROLE_ADMIN', 'ROLE_ONC'],
  },
}, {
  name: 'reports.atls',
  url: '/onc-atls',
  component: 'chplReportsAtls',
  data: {
    title: 'CHPL Reports - ONC-ATLs',
    roles: ['ROLE_ADMIN', 'ROLE_ONC'],
  },
}, {
  name: 'reports.listings',
  url: '/listings/{productId}?',
  component: 'chplReportsListings',
  params: {
    productId: { squash: true, value: null },
  },
  resolve: {
    productId: ($transition$) => {
      'ngInject';

      return $transition$.params().productId;
    },
  },
  data: { title: 'CHPL Reports - Listings' },
}, {
  name: 'reports.developers',
  url: '/developers',
  component: 'chplReportsDevelopers',
  data: { title: 'CHPL Reports - Developers' },
}, {
  name: 'reports.products',
  url: '/products',
  component: 'chplReportsProducts',
  data: { title: 'CHPL Reports - Products' },
}, {
  name: 'reports.user-actions',
  url: '/user-actions',
  component: 'chplReportsUserActions',
  data: {
    title: 'CHPL Reports - User Actions',
    roles: ['ROLE_ADMIN', 'ROLE_ONC'],
  },
}, {
  name: 'reports.users',
  url: '/users',
  component: 'chplReportsUsers',
  data: {
    title: 'CHPL Reports - Users',
    roles: ['ROLE_ADMIN', 'ROLE_ONC'],
  },
}, {
  name: 'reports.versions',
  url: '/versions',
  component: 'chplReportsVersions',
  data: { title: 'CHPL Reports - Versions' },
}];

function reportsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default reportsStatesConfig;
