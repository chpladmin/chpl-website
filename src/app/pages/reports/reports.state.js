const states = [{
  name: 'reports',
  abstract: true,
  url: '/reports',
  component: 'chplReports',
  data: {
    title: 'CHPL Activity',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'reports.acbs',
  url: '/onc-acbs',
  component: 'chplReportsAcbs',
  data: {
    title: 'CHPL Activity - ONC-ACBs',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'reports.announcements',
  url: '/announcements',
  component: 'chplReportsAnnouncements',
  data: {
    title: 'CHPL Activity - Announcements',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  name: 'reports.api-keys',
  url: '/api-keys',
  component: 'chplReportsApiKeys',
  data: {
    title: 'CHPL Activity - Api Key Management',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  name: 'reports.atls',
  url: '/onc-atls',
  component: 'chplReportsAtls',
  data: {
    title: 'CHPL Activity - ONC-ATLs',
    roles: ['chpl-admin', 'chpl-onc'],
  },
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
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  name: 'reports.user-actions',
  url: '/user-actions',
  component: 'chplReportsUserActions',
  data: {
    title: 'CHPL Activity - User Actions',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  name: 'reports.users',
  url: '/users',
  component: 'chplReportsUsers',
  data: {
    title: 'CHPL Activity - Users',
    roles: ['chpl-admin', 'chpl-onc'],
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
