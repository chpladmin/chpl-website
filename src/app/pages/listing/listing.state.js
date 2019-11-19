let states = [{
    name: 'listing',
    url: '/listing/{id}/{initialPanel}',
    params: {
        initialPanel: {squash: true, value: null},
    },
    component: 'chplListing',
    data: { title: 'CHPL Product Details' },
},{
    name: 'product',
    url: '/product/{id}',
    redirectTo: trans => {
        return {
            state: 'listing',
            params: {
                id: trans.params().id,
            },
        }
    },
},{
    name: 'product.initial-panel',
    url: '/{initialPanel}',
    redirectTo: trans => {
        return {
            state: 'listing',
            params: {
                id: trans.params().id,
                initialPanel: trans.params().initialPanel,
            },
        }
    },
}];

function listingStatesConfig ($stateProvider) {
    'ngInject'
    states.forEach(state => {
        $stateProvider.state(state);
    });
}

export { listingStatesConfig };
