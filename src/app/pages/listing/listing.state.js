const states = [{
  name: 'listing',
  url: '/listing/{id}',
  component: 'chplListing',
  data: { title: 'CHPL Listing Details' },
}, {
  name: 'product',
  url: '/product/{id}',
  redirectTo: (trans) => ({
    state: 'listing',
    params: {
      id: trans.params().id,
    },
  }),
}];

function listingStatesConfig($stateProvider) {
  'ngInject';

  states.forEach((state) => {
    $stateProvider.state(state);
  });
}

export default listingStatesConfig;
