function getResources ($q, networkService) {
    'ngInject'
    let promises = [
        networkService.getSearchOptions()
            .then(response => ({
                bodies: response.certBodyNames,
                classifications: response.productClassifications,
                editions: response.editions,
                practices: response.practiceTypeNames,
                statuses: response.certificationStatuses,
            })),
        networkService.getAtls(false)
            .then(response => ({ testingLabs: response.atls })),
        networkService.getQmsStandards()
            .then(response => ({ qmsStandards: response })),
        networkService.getAccessibilityStandards()
            .then(response => ({ accessibilityStandards: response })),
        networkService.getUcdProcesses()
            .then(response => ({ ucdProcesses: response })),
        networkService.getTestProcedures()
            .then(response => ({ testProcedures: response })),
        networkService.getTestData()
            .then(response => ({ testData: response })),
        networkService.getTestStandards()
            .then(response => ({ testStandards: response })),
        networkService.getTestFunctionality()
            .then(response => ({ testFunctionalities: response })),
        networkService.getTestTools()
            .then(response => ({ testTools: response })),
        networkService.getTargetedUsers()
            .then(response => ({ targetedUsers: response })),
    ];
    return $q.all(promises)
        .then(response => response[0]);
}

function administrationStateConfig ($stateProvider) {
    'ngInject'
    $stateProvider
        .state('administration', {
            abstract: true,
            url: '/administration',
            template: '<div class="container-fluid"><div class="row"><div class="col-sm-12"><h1>CHPL Administration</h1></div></div>><div class="main-content row" id="main-content" tabindex="-1"><div class="col-sm-12"><ui-view/></div></div></div>',
        })
        .state('administration.confirm', {
            abstract: true,
            url: '/confirm',
            template: '<ui-view/></div>',
        })
        .state('administration.confirm.listings', {
            url: '/listings',
            component: 'chplConfirmListings',
            resolve: {
                developers: networkService => networkService.getDevelopers().then(response => response.developers),
                resources: ($q, networkService) => getResources($q, networkService),
            },
            data: { title: 'CHPL Reports - Listings' },
        })
        .state('administration.features', {
            url: '/features',
            component: 'chplFeatures',
            data: { title: 'CHPL Feature Flags' },
        });
}

module.exports = administrationStateConfig;
