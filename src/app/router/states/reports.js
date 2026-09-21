import PassthroughView from '../passthrough-view';

import ChplActivityWrapper from 'pages/reports/activity/activity-wrapper';
import ChplQuestionableActivityWrapper from 'pages/reports/questionable-activity/questionable-activity-wrapper';

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
  component: ChplActivityWrapper,
  data: {
    title: 'CHPL Activity',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}, {
  name: 'reports.questionable-activity',
  url: '/questionable-activity',
  component: ChplQuestionableActivityWrapper,
  data: {
    title: 'CHPL Activity - Questionable Activity',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}];

export default states;
