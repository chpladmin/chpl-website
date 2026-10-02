import { lazy } from 'react';

const states = [{
  name: 'charts',
  url: '/charts',
  component: lazy(() => import('pages/charts/charts')),
  data: { title: 'CHPL Charts' },
}];

export default states;
