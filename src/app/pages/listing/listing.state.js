const states = [{
  name: 'listing',
  url: '/listing/{id}',
  component: 'chplListing',
  data: { title: 'CHPL Listing Details' },
}, {
  name: 'listing.edit',
  url: '/edit',
  component: 'chplListingEditBridge',
  data: {
    title: 'CHPL Listing Details - Edit',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  },
  resolve: {
    listing: (networkService, $transition$) => {
      'ngInject';

      return networkService.getListing($transition$.params().id);
    },
  },
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
