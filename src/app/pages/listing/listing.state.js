/* global DEVELOPER_MODE */

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

function listingStateConfig ($stateProvider) {
    'ngInject'
    if (DEVELOPER_MODE) {
        states['listing-edit-on'].forEach(state => {
            $stateProvider.state(state);
        });
    } else {
        states['listing-edit-off'].forEach(state => {
            $stateProvider.state(state);
        });
    }
}

export { listingStateConfig };
