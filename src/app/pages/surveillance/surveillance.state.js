const states = [{
  name: 'surveillance',
  abstract: true,
  url: '/surveillance',
  component: 'chplSurveillance',
  data: {
    title: 'CHPL Surveillance',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'surveillance.complaints',
  url: '/complaints',
  component: 'chplComplaintsWrapperBridge',
  data: {
    title: 'CHPL Surveillance - Complaints Reporting',
  },
}, {
  name: 'surveillance.activity-reporting',
  url: '/activity-reporting',
  component: 'chplSurveillanceActivityReporting',
  data: {
    title: 'CHPL Surveillance - Activity Reporting',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  name: 'surveillance.reporting',
  url: '/reporting',
  component: 'chplSurveillanceReportingBridge',
  data: {
    title: 'CHPL Surveillance - Complaints Reporting',
  },
}];

function surveillanceStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}
export default surveillanceStatesConfig;
