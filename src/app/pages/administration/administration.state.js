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
            url: '/administration',
            component: 'chplAdministration',
            data: { title: 'CHPL Administration' },
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
    ;
}

module.exports = administrationStateConfig;
