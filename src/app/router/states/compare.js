import { lazy } from 'react';

const states = [{
  name: 'compare',
  url: '/compare/{ids}',
  component: lazy(() => import('pages/compare/compare-wrapper')),
  params: {
    ids: { squash: true, value: null },
  },
  resolve: [
    { token: 'ids', deps: ['$transition$'], resolveFn: (transition) => transition.params().ids },
  ],
  data: { title: 'CHPL Product Comparison' },
}];

export default states;
