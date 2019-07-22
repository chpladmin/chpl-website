let getResources = ($q, networkService) => {
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
        .then(response => response);
}

function administrationStateConfig ($stateProvider) {
    'ngInject'
    $stateProvider
        .state('administration', {
            url: '/administration',
            component: 'chplAdministration',
            data: { title: 'CHPL Administration' },
        })
        .state('administration.announcements', {
            url: '/announcements',
            component: 'chplAnnouncements',
            resolve: {
                announcements: networkService => {
                    'ngInject'
                    return networkService.getAnnouncements(true);
                },
            },
            data: { title: 'CHPL Administration - Announcements' },
        })
        .state('administration.api-keys', {
            url: '/api-keys',
            component: 'chplApiKeys',
            resolve: {
                apiKeys: networkService => {
                    'ngInject'
                    return networkService.getApiUsers();
                },
            },
            data: { title: 'CHPL Administration - API Keys' },
        })
        .state('administration.cms', {
            url: '/cms',
            component: 'chplCms',
            data: { title: 'CHPL Administration - CMS' },
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
                developers: networkService => {
                    'ngInject'
                    return networkService.getDevelopers().then(response => response.developers);
                },
                resources: ($q, networkService) => {
                    'ngInject'
                    return getResources($q, networkService);
                },
            },
            data: { title: 'CHPL Reports - Listings' },
        })
        .state('administration.fuzzy', {
            url: '/fuzzy-matching',
            component: 'chplFuzzyMatching',
            resolve: {
                fuzzyTypes: networkService => {
                    'ngInject'
                    return networkService.getFuzzyTypes();
                },
            },
            data: { title: 'CHPL Administration - Fuzzy Matching' },
        })
        .state('administration.jobs', {
            abstract: true,
            url: '/jobs',
            template: '<ui-view/></div>',
        })
        .state('administration.jobs.background', {
            url: '/background',
            component: 'chplJobsBackgroundPage',
            resolve: {
                types: networkService => {
                    'ngInject'
                    return networkService.getJobTypes();
                },
            },
            data: { title: 'CHPL Administration - Jobs - Background' },
        })
        .state('administration.jobs.scheduled', {
            url: '/scheduled',
            component: 'chplJobsScheduledPage',
            resolve: {
                acbs: networkService => {
                    'ngInject'
                    return networkService.getAcbs(true);
                },
                jobs: networkService => {
                    'ngInject'
                    return networkService.getScheduleJobs();
                },
                triggers: networkService => {
                    'ngInject'
                    return networkService.getScheduleTriggers();
                },
            },
            data: { title: 'CHPL Administration - Jobs - Scheduled' },
        })
        .state('administration.upload', {
            url: '/upload',
            component: 'chplUpload',
            data: { title: 'CHPL Administration - Upload' },
        })
    ;
}

module.exports = administrationStateConfig;
