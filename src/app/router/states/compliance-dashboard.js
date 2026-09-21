import { lazy } from 'react';

const states = [{
  name: 'compliance-dashboard',
  url: '/compliance-dashboard',
  component: lazy(() => import('pages/compliance-dashboard/compliance-dashboard-wrapper')),
  data: {
    title: 'Compliance Dashboard',
    roles: ['chpl-admin', 'chpl-onc'],
  },
}];

export default states;
