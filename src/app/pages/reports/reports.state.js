const states = [{
  name: 'reports',
  abstract: true,
  url: '/reports',
  component: 'chplReports',
  data: {
    title: 'CHPL Activity',
    roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL'],
  },
}, {
  name: 'reports.acbs',
  url: '/onc-acbs',
  component: 'chplReportsAcbs',
  data: {
    title: 'CHPL Activity - ONC-ACBs',
    roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB'],
  },
}, {
  name: 'reports.announcements',
  url: '/announcements',
  component: 'chplReportsAnnouncements',
  data: {
    title: 'CHPL Activity - Announcements',
    roles: ['ROLE_ADMIN', 'ROLE_ONC'],
  },
}, {
  name: 'reports.api-keys',
  url: '/api-keys',
  component: 'chplReportsApiKeys',
  data: {
    title: 'CHPL Activity - Api Key Management',
    roles: ['ROLE_ADMIN', 'ROLE_ONC'],
  },
}, {
  name: 'reports.atls',
  url: '/onc-atls',
  component: 'chplReportsAtls',
  data: {
    title: 'CHPL Activity - ONC-ATLs',
    roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ATL'],
  },
}, {
  name: 'reports.listings',
  url: '/listings/{listingId}?',
  component: 'chplReportsListings',
  params: {
    listingId: { squash: true, value: null },
  },
  resolve: {
    productId: ($transition$) => {
      'ngInject';

      return $transition$.params().productId;
    },
  },
  data: { title: 'CHPL Activity - Listings' },
}, {
  name: 'reports.developers',
  url: '/developers',
  component: 'chplReportsDevelopers',
  data: { title: 'CHPL Activity - Developers' },
}, {
  name: 'reports.products',
  url: '/products',
  component: 'chplReportsProducts',
  data: { title: 'CHPL Activity - Products' },
}, {
  name: 'reports.questionable-activity',
  url: '/questionable-activity',
  component: 'chplQuestionableActivityWrapperBridge',
  data: {
    title: 'CHPL Activity - Questionable Activity',
    roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'],
  },
}, {
  name: 'reports.user-actions',
  url: '/user-actions',
  component: 'chplReportsUserActions',
  data: {
    title: 'CHPL Activity - User Actions',
    roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'],
  },
}, {
  name: 'reports.users',
  url: '/users',
  component: 'chplReportsUsers',
  data: {
    title: 'CHPL Activity - Users',
    roles: ['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF'],
  },
}, {
  name: 'reports.versions',
  url: '/versions',
  component: 'chplReportsVersions',
  data: { title: 'CHPL Activity - Versions' },
}];

function reportsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default reportsStatesConfig;
