import { lazy } from 'react';

import PassthroughView from '../passthrough-view';

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
  component: lazy(() => import('components/surveillance/complaints/complaints-wrapper')),
  data: {
    title: 'CHPL Surveillance - Complaints Reporting',
  },
}, {
  name: 'surveillance.activity-reporting',
  url: '/activity-reporting',
  component: lazy(() => import('pages/surveillance/activity-reporting/activity-reporting-wrapper')),
  data: {
    title: 'CHPL Surveillance - Activity Reporting',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  // also inherits roles from the parent
  name: 'surveillance.reporting',
  url: '/reporting',
  component: lazy(() => import('pages/surveillance/reporting/reporting-wrapper')),
  data: {
    title: 'CHPL Surveillance - Complaints Reporting',
  },
}];

export default states;
