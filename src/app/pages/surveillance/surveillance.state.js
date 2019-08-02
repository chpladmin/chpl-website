let states = {
    'complaints-on': [
        {
            name: 'surveillance.complaints',
            url: '/complaints',
            component: 'chplSurveillanceComplaints',
            data: {
                title: 'CHPL Surveillance - Complaints',
            },
            ncyBreadcrumb: {
                label: 'Complaints',
            },
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
                surveillanceOutcomes: networkService => {
                    'ngInject'
                    return networkService.getSurveillanceOutcomes().catch(() => angular.noop); // remove catch when API has this endpoint
                },
                surveillanceProcessTypes: networkService => {
                    'ngInject'
                    return networkService.getSurveillanceProcessTypes().catch(() => angular.noop); // remove catch when API has this endpoint
                },
            },
            data: { title: 'CHPL Surveillance - Reporting' },
            ncyBreadcrumb: {
                label: 'Reporting',
            },
        },{
            name: 'surveillance.reporting.annual',
            url: '/annual/{reportId}',
            component: 'chplSurveillanceReportAnnual',
            resolve: {
                report: ($transition$, networkService) => {
                    'ngInject'
                    return networkService.getAnnualSurveillanceReport($transition$.params().reportId);
                },
            },
            data: { title: 'CHPL Surveillance - Reporting - Annual' },
            ncyBreadcrumb: {
                label: '{{ $resolve.report.acb.name }} - {{ $resolve.report.year }}',
            },
        },{
            name: 'surveillance.reporting.quarterly',
            url: '/quarterly/{reportId}',
            component: 'chplSurveillanceReportQuarter',
            resolve: {
                report: ($transition$, networkService) => {
                    'ngInject'
                    return networkService.getQuarterlySurveillanceReport($transition$.params().reportId);
                },
                relevantListings: ($transition$, networkService) => {
                    'ngInject'
                    return networkService.getRelevantListings($transition$.params().reportId);
                },
            },
            data: { title: 'CHPL Surveillance - Reporting - Quarterly' },
            ncyBreadcrumb: {
                label: '{{ $resolve.report.acb.name }} - {{ $resolve.report.year }} - {{ $resolve.report.quarter }}',
            },
        },
    ],
    'ocd-1277-on': [
        {
            name: 'surveillance.manage',
            url: '/manage',
            params: {
                listingId: {squash: true, value: null},
                chplProductNumber: {squash: true, value: null},
            },
            component: 'chplSurveillanceManagement',
            resolve: {
                allowedAcbs: networkService => {
                    'ngInject'
                    return networkService.getAcbs(true);
                },
                listings: networkService => {
                    'ngInject'
                    return networkService.getCollection('surveillanceManagement');
                },
            },
            data: { title: 'CHPL Surveillance - Manage' },
            ncyBreadcrumb: {
                label: 'Manage',
            },
        },
    ],
    'base': [
        {
            name: 'surveillance',
            abstract: true,
            url: '/surveillance',
            component: 'chplSurveillance',
            data: { title: 'CHPL Surveillance' },
            ncyBreadcrumb: {
                label: 'Surveillance',
            },
        },{
            name: 'surveillance.upload',
            url: '/upload',
            component: 'chplUploadSurveillances',
            data: { title: 'CHPL Surveillance - Upload' },
            ncyBreadcrumb: {
                label: 'Upload',
            },
        },{
            name: 'surveillance.confirm',
            url: '/confirm',
            component: 'chplConfirmSurveillance',
            data: { title: 'CHPL Surveillance - Confirmation' },
            ncyBreadcrumb: {
                label: 'Confirm',
            },
        },{
            name: 'surveillance.complaints',
            url: '/complaints',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Surveillance - Complaints' },
        },{
            name: 'surveillance.manage',
            url: '/manage',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Surveillance - Manage' },
        },{
            name: 'surveillance.reporting',
            url: '/reporting',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Surveillance - Reporting' },
        },{
            name: 'surveillance.reporting.annual',
            url: '/annual/{reportId}',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Surveillance - Reporting - Annual' },
        },{
            name: 'surveillance.reporting.quarterly',
            url: '/quarterly/{reportId}',
            template: '<div><i class="fa fa-spin fa-spinner"></i></div>',
            data: { title: 'CHPL Surveillance - Reporting - Quarterly' },
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
