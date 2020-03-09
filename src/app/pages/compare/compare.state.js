let states = [
    {
        name: 'compare',
        url: '/compare/{compareIds}',
        component: 'chplCompare',
        data: { title: 'CHPL Product Comparison' },
    },
];

function compareStatesConfig ($stateProvider) {
    'ngInject'
    states.forEach(state => {
        $stateProvider.state(state);
    });
}

export { compareStatesConfig };
