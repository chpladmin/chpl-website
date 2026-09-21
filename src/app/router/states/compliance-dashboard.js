import ChplComplianceDashboardWrapper from 'pages/compliance-dashboard/compliance-dashboard-wrapper';

const states = [{
  name: 'compliance-dashboard',
  url: '/compliance-dashboard',
  component: ChplComplianceDashboardWrapper,
  data: {
    title: 'Compliance Dashboard',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}];

export default states;
