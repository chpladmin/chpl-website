let states = [{
    name: 'charts',
    url: '/charts',
    component: 'chplCharts',
    data: { title: 'CHPL Charts' },
}];

function chartsStatesConfig ($stateProvider) {
    'ngInject'
    states.forEach(state => {
        $stateProvider.state(state);
    });
}

export { chartsStatesConfig };
