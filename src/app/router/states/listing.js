import ChplListingPage from 'pages/listing/listing-wrapper';

const states = [{
  name: 'listing',
  url: '/listing/{id}',
  component: ChplListingPage,
  // replaces the chplListing Angular component, which existed only to read
  // $stateParams.id and hand it to the bridge as a binding
  resolve: [
    { token: 'id', deps: ['$transition$'], resolveFn: (transition) => transition.params().id },
  ],
  data: { title: 'CHPL Listing Details' },
}, {
  name: 'product',
  url: '/product/{id}',
  redirectTo: (transition) => ({
    state: 'listing',
    params: {
      id: transition.params().id,
    },
  }),
}];

export default states;
