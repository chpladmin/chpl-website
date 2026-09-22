import { lazy } from 'react';

import PassthroughView from '../passthrough-view';

const states = [{
  name: 'reports',
  abstract: true,
  url: '/reports',
  component: PassthroughView,
  data: {
    title: 'CHPL Activity',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
}, {
  name: 'reports.activity',
  url: '/activity',
  component: lazy(() => import('pages/reports/activity/activity-wrapper')),
  data: {
    title: 'CHPL Activity',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  name: 'reports.questionable-activity',
  url: '/questionable-activity',
  component: lazy(() => import('pages/reports/questionable-activity/questionable-activity-wrapper')),
  data: {
    title: 'CHPL Activity - Questionable Activity',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}];

export default states;
