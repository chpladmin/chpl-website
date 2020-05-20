let states = [{
    name: 'registration',
    abstract: true,
    url: '/registration',
    template: '<ui-view/>',
},{
    name: 'registration.create-user',
    url: '/create-user/{hash}',
    template: require('./create-user.html'),
    controller: 'CreateController',
    controllerAs: 'vm',
    /*
    params: {
        productId: {squash: true, value: null},
    },
    resolve: {
        productId: $transition$ => {
            'ngInject'
            return $transition$.params().productId;
        },
    },
    */
    data: { title: 'CHPL Registration' },
},{
    name: 'registration.confirm-user',
    url: '/confirm-user/{hash}',
    template: require('./confirm-user.html'),
    controller: 'ConfirmController',
    controllerAs: 'vm',
    data: { title: 'CHPL Registration' },
}];

function registrationStatesConfig ($stateProvider) {
    'ngInject'
    states.forEach(state => {
        $stateProvider.state(state);
    });
}

export { registrationStatesConfig };
