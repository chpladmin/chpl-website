function collectionsStateConfig ($stateProvider) {
    'ngInject'
    $stateProvider
        .state('collections', {
            abstract: true,
            url: '/collections',
            template: '<ui-view/>',
        })
        .state('collections.apiDocumentation', {
            url: '/api-documentation',
            controller: 'ApiDocumentationController',
            controllerAs: 'vm',
            template: require('./api-documentation/api-documentation.html'),
            data: { title: 'API Information for 2015 Edition Products' },
        })
        .state('collections.correctiveAction', {
            url: '/corrective-action',
            controller: 'CorrectiveActionController',
            controllerAs: 'vm',
            template: require('./corrective-action/corrective-action.html'),
            data: { title: 'Products: Corrective Action Status' },
        })
        .state('collections.developers', {
            url: '/developers',
            controller: 'BannedDevelopersController',
            controllerAs: 'vm',
            template: require('./developers/developers.html'),
            data: { title: 'Banned Developers' },
        })
        .state('collections.inactive', {
            url: '/inactive',
            controller: 'InactiveCertificatesController',
            controllerAs: 'vm',
            template: require('./inactive/inactive.html'),
            data: { title: 'Inactive Certificates' },
        })
        .state('collections.products', {
            url: '/products',
            controller: 'DecertifiedProductsController',
            controllerAs: 'vm',
            template: require('./products/products.html'),
            data: { title: 'Decertified Products' },
        })
        .state('collections.sed', {
            url: '/sed',
            controller: 'SedCollectionController',
            controllerAs: 'vm',
            template: require('./sed/sed.html'),
            data: { title: 'SED Information for 2014 &amp; 2015 Edition Products' },
        })
        .state('collections.transparencyAttestations', {
            url: '/transparency-attestations',
            controller: 'TransparencyAttestationsController',
            controllerAs: 'vm',
            template: require('./transparency-attestations/transparency-attestations.html'),
            data: { title: 'Transparency Attestations' },
        });
}

module.exports = collectionsStateConfig;
