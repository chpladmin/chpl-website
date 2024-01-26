const states = [{
  name: 'surveillance',
  abstract: true,
  url: '/surveillance',
  component: 'chplSurveillance',
  data: {
    title: 'CHPL Surveillance',
    roles: ['chpl-admin', 'ROLE_ONC', 'chpl-onc-acb'],
  },
  ncyBreadcrumb: {
    label: 'Surveillance',
  },
}, {
  name: 'surveillance.complaints',
  url: '/complaints',
  component: 'chplComplaintsWrapperBridge',
  data: {
    title: 'CHPL Surveillance - Complaints Reporting',
  },
}, {
  name: 'surveillance.manage',
  url: '/manage',
  params: {
    listingId: { squash: true, value: null },
    chplProductNumber: { squash: true, value: null },
  },
  component: 'chplSurveillanceManagement',
  resolve: {
    allowedAcbs: (networkService) => {
      'ngInject';

      return networkService.getAcbs(true);
    },
    listings: (networkService) => {
      'ngInject';

      return networkService.getCollection('surveillanceManagement');
    },
  },
  data: {
    title: 'CHPL Surveillance - Manage',
    roles: ['chpl-admin', 'chpl-onc-acb'],
  },
  ncyBreadcrumb: {
    label: 'Manage',
  },
}, {
  name: 'surveillance.activity-reporting',
  url: '/activity-reporting',
  component: 'chplSurveillanceActivityReporting',
  data: {
    title: 'CHPL Surveillance - Activity Reporting',
    roles: ['chpl-admin', 'ROLE_ONC'],
  },
  ncyBreadcrumb: {
    label: 'Activity Reporting',
  },
}, {
  name: 'surveillance.reporting',
  url: '/reporting',
  component: 'chplSurveillanceReporting',
  resolve: {
    acbs: (networkService) => {
      'ngInject';

      return networkService.getAcbs(true);
    },
    annual: (networkService) => {
      'ngInject';

      return networkService.getAnnualSurveillanceReports();
    },
    availableQuarters: (networkService) => {
      'ngInject';

      return networkService.getQuarterlySurveillanceQuarters();
    },
    quarters: (networkService) => {
      'ngInject';

      return networkService.getQuarterlySurveillanceReports();
    },
    surveillanceOutcomes: (networkService) => {
      'ngInject';

      return networkService.getSurveillanceOutcomes();
    },
    surveillanceProcessTypes: (networkService) => {
      'ngInject';

      return networkService.getSurveillanceProcessTypes();
    },
  },
  data: { title: 'CHPL Surveillance - Reporting' },
  ncyBreadcrumb: {
    label: 'Reporting',
  },
}, {
  name: 'surveillance.reporting.annual',
  url: '/annual/{reportId}',
  component: 'chplSurveillanceReportAnnual',
  resolve: {
    report: ($transition$, networkService) => {
      'ngInject';

      return networkService.getAnnualSurveillanceReport($transition$.params().reportId);
    },
  },
  data: { title: 'CHPL Surveillance - Reporting - Annual' },
  ncyBreadcrumb: {
    label: '{{ $resolve.report.acb.name }} - {{ $resolve.report.year }}',
  },
}, {
  name: 'surveillance.reporting.quarterly',
  url: '/quarterly/{reportId}',
  params: {
    relevantListing: { squash: true, value: null },
  },
  component: 'chplSurveillanceReportQuarter',
  resolve: {
    report: ($transition$, networkService) => {
      'ngInject';

      return networkService.getQuarterlySurveillanceReport($transition$.params().reportId);
    },
    relevantListing: ($transition$) => {
      'ngInject';

      return $transition$.params().relevantListing;
    },
    relevantListings: ($transition$, networkService) => {
      'ngInject';

      return networkService.getRelevantListings($transition$.params().reportId);
    },
  },
  data: { title: 'CHPL Surveillance - Reporting - Quarterly' },
  ncyBreadcrumb: {
    label: '{{ $resolve.report.acb.name }} - {{ $resolve.report.year }} - {{ $resolve.report.quarter }}',
  },
}];

function surveillanceStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}
export default surveillanceStatesConfig;
