import ChplComparePage from 'pages/compare/compare-wrapper';

const states = [{
  name: 'compare',
  url: '/compare/{ids}',
  component: ChplComparePage,
  params: {
    ids: { squash: true, value: null },
  },
  resolve: [
    { token: 'ids', deps: ['$transition$'], resolveFn: (transition) => transition.params().ids },
  ],
  data: { title: 'CHPL Product Comparison' },
}];

export default states;
