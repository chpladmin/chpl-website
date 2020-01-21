let getResources = ($q, networkService) => {
    let promises = [
        networkService.getSearchOptions()
            .then(response => ({
                bodies: response.acbs,
                classifications: response.productClassifications,
                editions: response.editions,
                practices: response.practiceTypes,
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

let states = {
    'change-request': [
        {
            name: 'administration.change-requests',
            url: '/change-requests',
            component: 'chplChangeRequestsManagement',
            resolve: {
                changeRequests: (authService, featureFlags, networkService) => {
                    'ngInject'
                    if (featureFlags.isOn('change-request')) {
                        if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                            return networkService.getChangeRequests();
                        } else {
                            return [];
                        }
                    }
                },
                changeRequestStatusTypes: (authService, featureFlags, networkService) => {
                    'ngInject'
                    if (featureFlags.isOn('change-request')) {
                        if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                            return networkService.getChangeRequestStatusTypes();
                        } else {
                            return [];
                        }
                    }
                },
                changeRequestTypes: (authService, featureFlags, networkService) => {
                    'ngInject'
                    if (featureFlags.isOn('change-request')) {
                        if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                            return networkService.getChangeRequestTypes();
                        } else {
                            return [];
                        }
                    }
                },
            },
            data: { title: 'CHPL Administration - Change Requests' },
        },
    ],
    'base': [
        {
            name: 'authorizePasswordReset',
            url: '/admin/authorizePasswordReset?token',
            redirectTo: trans => {
                return {
                    state: 'administration',
                    params: {
                        token: trans.params().token,
                    },
                }
            },
        },{
            name: 'administration',
            url: '/administration?token',
            component: 'chplAdministration',
            data: { title: 'CHPL Administration' },
        },{
            name: 'administration.announcements',
            url: '/announcements',
            component: 'chplAnnouncements',
            resolve: {
                announcements: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                        return networkService.getAnnouncements(true);
                    }
                    return [];
                },
            },
            data: { title: 'CHPL Administration - Announcements' },
        },{
            name: 'administration.api-keys',
            url: '/api-keys',
            component: 'chplApiKeys',
            resolve: {
                apiKeys: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'] )) {
                        return networkService.getApiUsers();
                    }
                    return [];
                },
            },
            data: { title: 'CHPL Administration - API Keys' },
        },{
            name: 'administration.change-requests',
            url: '/change-requests',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Administration - Change Requests' },
        },{
            name: 'administration.cms',
            url: '/cms',
            component: 'chplCms',
            data: { title: 'CHPL Administration - CMS' },
        },{
            name: 'administration.confirm',
            abstract: true,
            url: '/confirm',
            template: '<ui-view/>',
        },{
            name: 'administration.confirm.listings',
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
        },{
            name: 'administration.fuzzy-matching',
            url: '/fuzzy-matching',
            component: 'chplFuzzyMatching',
            resolve: {
                fuzzyTypes: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                        return networkService.getFuzzyTypes();
                    }
                    return [];
                },
            },
            data: { title: 'CHPL Administration - Fuzzy Matching' },
        },{
            name: 'administration.jobs',
            abstract: true,
            url: '/jobs',
            template: '<ui-view/>',
        },{
            name: 'administration.jobs.background',
            url: '/background',
            component: 'chplJobsBackgroundPage',
            resolve: {
                types: networkService => {
                    'ngInject'
                    return networkService.getJobTypes();
                },
            },
            data: { title: 'CHPL Administration - Jobs - Background' },
        },{
            name: 'administration.jobs.scheduled',
            url: '/scheduled',
            component: 'chplJobsScheduledPage',
            resolve: {
                acbs: networkService => {
                    'ngInject'
                    return networkService.getAcbs(true);
                },
                jobs: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                        return networkService.getScheduleJobs();
                    }
                    return [];
                },
                scheduledSystemJobs: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                        return networkService.getScheduledSystemJobs();
                    }
                    return [];
                },
                triggers: (authService, networkService) => {
                    'ngInject'
                    if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                        return networkService.getScheduleTriggers();
                    }
                    return [];
                },
            },
            data: { title: 'CHPL Administration - Jobs - Scheduled' },
        },{
            name: 'administration.upload',
            url: '/upload',
            component: 'chplUpload',
            data: { title: 'CHPL Administration - Upload' },
        },
    ],
}

function administrationStatesConfig ($stateProvider) {
    'ngInject'
    states['base'].forEach(state => {
        $stateProvider.state(state);
    });
}

export { administrationStatesConfig, states };
