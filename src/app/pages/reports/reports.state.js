let states = {
    'enhanced-reports': [
        {
            name: 'reports.listings',
            url: '/listings/{productId}?',
            component: 'chplReportsListings',
            params: {
                productId: {squash: true, value: null},
            },
            resolve: {
                productId: $transition$ => {
                    'ngInject'
                    return $transition$.params().productId;
                },
            },
            data: { title: 'CHPL Reports - Listings' },
        },
    ],
    'base': [
        {
            name: 'reports',
            abstract: true,
            url: '/reports',
            component: 'chplReports',
            data: { title: 'CHPL Reports' },
        },{
            name: 'reports.acbs',
            url: '/onc-acbs',
            component: 'chplReportsAcbs',
            data: { title: 'CHPL Reports - ONC-ACBs' },
        },{
            name: 'reports.announcements',
            url: '/announcements',
            component: 'chplReportsAnnouncements',
            data: { title: 'CHPL Reports - Announcements' },
        },{
            name: 'reports.api-keys',
            url: '/api-keys',
            component: 'chplReportsApiKeys',
            data: { title: 'CHPL Reports - Api Key Management' },
        },{
            name: 'reports.api-key-usage',
            url: '/api-key-usage',
            component: 'chplReportsApiKeyUsage',
            data: { title: 'CHPL Reports - Api Key Usage' },
        },{
            name: 'reports.atls',
            url: '/onc-atls',
            component: 'chplReportsAtls',
            data: { title: 'CHPL Reports - ONC-ATLs' },
        },{
            name: 'reports.listings',
            url: '/listings/{productId}?',
            component: 'chplReportsListingsLegacy',
            params: {
                productId: {squash: true, value: null},
                filterToApply: {squash: true, value: null},
            },
            resolve: {
                productId: $transition$ => {
                    'ngInject'
                    return $transition$.params().productId;
                },
                filterToApply: $transition$ => {
                    'ngInject'
                    return $transition$.params().filterToApply;
                },
            },
            data: { title: 'CHPL Reports - Listings' },
        },{
            name: 'reports.developers',
            url: '/developers',
            component: 'chplReportsDevelopers',
            data: { title: 'CHPL Reports - Developers' },
        },{
            name: 'reports.products',
            url: '/products',
            component: 'chplReportsProducts',
            data: { title: 'CHPL Reports - Products' },
        },{
            name: 'reports.user-actions',
            url: '/user-actions',
            component: 'chplReportsUserActions',
            data: { title: 'CHPL Reports - User Actions' },
        },{
            name: 'reports.users',
            url: '/users',
            component: 'chplReportsUsers',
            data: { title: 'CHPL Reports - Users' },
        },{
            name: 'reports.versions',
            url: '/versions',
            component: 'chplReportsVersions',
            data: { title: 'CHPL Reports - Versions' },
        },
    ],
}

function reportsStatesConfig ($stateProvider) {
    'ngInject'
    states['base'].forEach(state => {
        $stateProvider.state(state);
    });
}

export { reportsStatesConfig, states };
