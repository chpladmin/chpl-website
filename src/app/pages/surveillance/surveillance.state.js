let states = {
    'complaints-on': [
        {
            name: 'administration.upload',
            abstract: true,
            url: '/confirm',
            template: '<ui-view/></div>',
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
            component: 'chplSurveillanceComplaints',
            data: { title: 'CHPL Surveillance - Complaints' },
        },
    ],
    'surveillance-reports-on': [
        {
            name: 'administration.upload',
            abstract: true,
            url: '/confirm',
            template: '<ui-view/></div>',
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
            name: 'surveillance.reporting',
            url: '/reporting',
            component: 'chplSurveillanceReporting',
            data: { title: 'CHPL Surveillance - Reporting' },
        },
    ],
    'complaints-on-and-surveillance-reports-on': [
        {
            name: 'administration.upload',
            abstract: true,
            url: '/confirm',
            template: '<ui-view/></div>',
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
            component: 'chplSurveillanceComplaints',
            data: { title: 'CHPL Surveillance - Complaints' },
        },{
            name: 'surveillance.reporting',
            url: '/reporting',
            component: 'chplSurveillanceReporting',
            data: { title: 'CHPL Surveillance - Reporting' },
        },
    ],
}

/**
 * This config can only be used when the both flags are set to true, or both are removed when fully deployed
 */
function surveillanceStateConfig ($stateProvider) {
    'ngInject'
    states['complaints-on-and-surveillance-reports-on'].forEach(state => {
        $stateProvider.state(state);
    });
}

export { surveillanceStateConfig, states };
