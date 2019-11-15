let states = {
    'effective-rule-date': [
        {
            name: 'collections.transparency-attestations',
            url: '/transparency-attestations',
            redirectTo: 'search',
        },
    ],
    'base': [
        {
            name: 'collections',
            abstract: true,
            url: '/collections',
            template: '<ui-view/>',
        },{
            name: 'collections.api-documentation',
            url: '/api-documentation',
            controller: 'ApiDocumentationController',
            controllerAs: 'vm',
            template: require('./api-documentation/api-documentation.html'),
            data: { title: 'API Information for 2015 Edition Products' },
        },{
            name: 'collections.corrective-action',
            url: '/corrective-action',
            controller: 'CorrectiveActionController',
            controllerAs: 'vm',
            template: require('./corrective-action/corrective-action.html'),
            data: { title: 'Products: Corrective Action Status' },
        },{
            name: 'collections.developers',
            url: '/developers',
            controller: 'BannedDevelopersController',
            controllerAs: 'vm',
            template: require('./developers/developers.html'),
            data: { title: 'Banned Developers' },
        },{
            name: 'collections.inactive',
            url: '/inactive',
            controller: 'InactiveCertificatesController',
            controllerAs: 'vm',
            template: require('./inactive/inactive.html'),
            data: { title: 'Inactive Certificates' },
        },{
            name: 'collections.products',
            url: '/products',
            controller: 'DecertifiedProductsController',
            controllerAs: 'vm',
            template: require('./products/products.html'),
            data: { title: 'Decertified Products' },
        },{
            name: 'collections.sed',
            url: '/sed',
            controller: 'SedCollectionController',
            controllerAs: 'vm',
            template: require('./sed/sed.html'),
            data: { title: 'SED Information for 2014 &amp; 2015 Edition Products' },
        },{
            name: 'collections.transparency-attestations',
            url: '/transparency-attestations',
            controller: 'TransparencyAttestationsController',
            controllerAs: 'vm',
            template: require('./transparency-attestations/transparency-attestations.html'),
            data: { title: 'Transparency Attestations' },
        },
    ],
};

function collectionsStatesConfig ($stateProvider) {
    'ngInject'
    states['base'].forEach(state => {
        $stateProvider.state(state);
    });
}
export { collectionsStatesConfig, states };
