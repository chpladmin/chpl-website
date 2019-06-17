let states = {
    'complaints-on': [
        {
            name: 'surveillance.complaints',
            url: '/complaints',
            component: 'chplSurveillanceComplaints',
            data: { title: 'CHPL Surveillance - Complaints' },
        },
    ],
    'surveillance-reports-on': [
        {
            name: 'surveillance.reporting',
            url: '/reporting',
            component: 'chplSurveillanceReporting',
            resolve: {
                acbs: networkService => {
                    'ngInject'
                    return networkService.getAcbs(true);
                },
                annual: networkService => {
                    'ngInject'
                    return networkService.getAnnualSurveillanceReports();
                },
                availableQuarters: networkService => {
                    'ngInject'
                    return networkService.getQuarterlySurveillanceQuarters();
                },
                quarters: networkService => {
                    'ngInject'
                    return networkService.getQuarterlySurveillanceReports();
                },
            },
            data: { title: 'CHPL Surveillance - Reporting' },
        },
    ],
    'base': [
        {
            name: 'administration.upload',
            abstract: true,
            url: '/confirm',
            template: '<ui-view/>',
        },{
            name: 'administration.upload.listings',
            url: '/listings',
            component: 'chplUploadListings',
            data: { title: 'CHPL Administration - Upload' },
        },{
            name: 'surveillance',
            abstract: true,
            url: '/surveillance',
            component: 'chplSurveillance',
            data: { title: 'CHPL Surveillance' },
        },{
            name: 'surveillance.upload',
            url: '/upload',
            component: 'chplUploadSurveillances',
            data: { title: 'CHPL Surveillance - Upload' },
        },{
            name: 'surveillance.confirm',
            url: '/confirm',
            component: 'chplConfirmSurveillance',
            data: { title: 'CHPL Surveillance - Confirmation' },
        },{
            name: 'surveillance.complaints',
            url: '/complaints',
            template: '<div>Coming soon</div>',
            data: { title: 'CHPL Surveillance - Complaints' },
        },{
            name: 'surveillance.reporting',
            url: '/reporting',
            template: '<div>Coming soon</div>',
            data: { title: 'CHPL Surveillance - Reporting' },
        },
    ],
}

/**
 * This config can only be used when the both flags are set to true, or both are removed when fully deployed
 */
function surveillanceStatesConfig ($stateProvider) {
    'ngInject'
    states['base'].forEach(state => {
        $stateProvider.state(state);
    });
}

export { surveillanceStatesConfig, states };
