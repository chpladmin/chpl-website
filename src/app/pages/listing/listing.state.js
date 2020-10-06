let states = [{
    name: 'listing',
    url: '/listing/{id}?panel',
    component: 'chplListing',
    resolve: {
        listing: (networkService, $location, $transition$) => {
            'ngInject';
            if (!$transition$.params().id) {
                $location.path('/search');
            } else {
                return networkService.getListing($transition$.params().id);
            }
        },
    },
    data: { title: 'CHPL Listing Details' },
},{
    name: 'listing.edit',
    url: '/edit',
    component: 'chplListingEditPage',
    resolve: {
        resources: ($q, networkService) => {
            'ngInject';
            let resources = {};
            return $q.all([
                networkService.getSearchOptions()
                    .then(response => {
                        resources.bodies = response.acbs;
                        resources.classifications = response.productClassifications;
                        resources.editions = response.editions;
                        resources.practices = response.practiceTypes;
                        resources.statuses = response.certificationStatuses;
                    }),
                networkService.getAccessibilityStandards().then(response => resources.accessibilityStandards = response),
                networkService.getAtls(false).then(response => resources.testingLabs = response.atls),
                networkService.getQmsStandards().then(response => resources.qmsStandards = response),
                networkService.getTargetedUsers().then(response => resources.targetedUsers = response),
                networkService.getTestData().then(response => resources.testData = response),
                networkService.getTestFunctionality().then(response => resources.testFunctionalities = response),
                networkService.getTestProcedures().then(response => resources.testProcedures = response),
                networkService.getTestStandards().then(response => resources.testStandards = response),
                networkService.getTestTools().then(response => resources.testTools = response),
                networkService.getUcdProcesses().then(response => resources.ucdProcesses = response),
            ]).then(() => {
                return resources;
            });
        },
    },
    data: { title: 'CHPL Listing Details - Edit' },
},{
    name: 'product',
    url: '/product/{id}',
    redirectTo: trans => {
        return {
            state: 'listing',
            params: {
                id: trans.params().id,
            },
        };
    },
},{
    name: 'product.initial-panel',
    url: '?panel',
    redirectTo: trans => {
        return {
            state: 'listing',
            params: {
                id: trans.params().id,
                panel: trans.params().panel,
            },
        };
    },
}];

function listingStatesConfig ($stateProvider) {
    'ngInject';
    states.forEach(state => {
        $stateProvider.state(state);
    });
}

export { listingStatesConfig };
