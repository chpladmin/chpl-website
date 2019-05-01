let states = {
    'listing-edit-on': [
        {
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
            name: 'product_initial_panel',
            url: '/product/{id}/{initialPanel}',
            redirectTo: trans => {
                return {
                    state: 'listing',
                    params: {
                        id: trans.params().id,
                        initialPanel: trans.params().initialPanel,
                    },
                }
            },
        },
    ],
    'listing-edit-off': [
        {
            name: 'product',
            url: '/product/{id}/{initialPanel}',
            params: {
                initialPanel: {squash: true, value: null},
            },
            template: require('../..//product/product.html'),
            controller: 'ProductController',
            controllerAs: 'vm',
            data: { title: 'CHPL Product Details' },
        },
    ],
}

/**
 * This config can only be used when the listing-edit flag is set to true and/or removed when listing-edit is fully deployed
 */
function listingStateConfig ($stateProvider) {
    'ngInject'
    states['listing-edit-on'].forEach(state => {
        $stateProvider.state(state);
    });
}

export { listingStateConfig, states };
