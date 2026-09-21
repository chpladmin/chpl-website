import PassthroughView from '../passthrough-view';

import ChplComplaintsWrapper from 'components/surveillance/complaints/complaints-wrapper';
import ChplSurveillanceActivityReporting from 'pages/surveillance/activity-reporting/activity-reporting-wrapper';
import ChplSurveillanceReporting from 'pages/surveillance/reporting/reporting-wrapper';

const states = [{
  name: 'surveillance',
  abstract: true,
  url: '/surveillance',
  component: PassthroughView,
  data: {
    title: 'CHPL Surveillance',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  // note: no roles of its own; inherits them from the abstract parent above
  name: 'surveillance.complaints',
  url: '/complaints',
  component: ChplComplaintsWrapper,
  data: {
    title: 'CHPL Surveillance - Complaints Reporting',
  },
}, {
  name: 'surveillance.activity-reporting',
  url: '/activity-reporting',
  component: ChplSurveillanceActivityReporting,
  data: {
    title: 'CHPL Surveillance - Activity Reporting',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  // also inherits roles from the parent
  name: 'surveillance.reporting',
  url: '/reporting',
  component: ChplSurveillanceReporting,
  data: {
    title: 'CHPL Surveillance - Complaints Reporting',
  },
}];

export default states;
