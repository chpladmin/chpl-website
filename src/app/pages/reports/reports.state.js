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
  name: 'reports.activity',
  url: '/activity',
  component: 'chplActivityWrapperBridge',
  data: {
    title: 'CHPL Activity',
    roles: ['chpl-admin', 'chpl-onc'],
  },
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
}];

function reportsStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default reportsStatesConfig;
