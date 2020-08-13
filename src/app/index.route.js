import { administrationStatesConfig as administrationStates } from './pages/administration/administration.state.js';
import { chartsStatesConfig as chartsStates } from './pages/charts/charts.state.js';
import { collectionsStatesConfig as collectionsStates } from './pages/collections/collections.state.js';
import { compareStatesConfig as compareStates } from './pages/compare/compare.state.js';
import { listingStatesConfig as listingStates } from './pages/listing/listing.state.js';
import { organizationsStatesConfig as organizationsStates } from './pages/organizations/organizations.state.js';
import { registrationStatesConfig as registrationStates } from './pages/registration/registration.state.js';
import { reportsStatesConfig as reportsStates } from './pages/reports/reports.state.js';
import { resourcesStatesConfig as resourcesStates } from './pages/resources/resources.state.js';
import { surveillanceStatesConfig as surveillanceStates } from './pages/surveillance/surveillance.state.js';
import { usersStatesConfig as usersStates } from './pages/users/users.state.js';

(function () {
    'use strict';

    angular
        .module('chpl')
        .config(routeConfig)
        .config(administrationStates)
        .config(chartsStates)
        .config(collectionsStates)
        .config(compareStates)
        .config(listingStates)
        .config(organizationsStates)
        .config(registrationStates)
        .config(reportsStates)
        .config(resourcesStates)
        .config(surveillanceStates)
        .config(usersStates);

    function routeConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('admin', {
                url: '/admin/{section}/{subSection}/{productId}?',
                params: {
                    section: {squash: true, value: null},
                    subSection: {squash: true, value: null},
                    productId: {squash: true, value: null},
                },
                template: require('./admin/admin.html'),
                controller: 'AdminController',
                controllerAs: 'vm',
                data: { title: 'CHPL Administration' },
            })
            .state('search', {
                url: '/search',
                controller: 'SearchController',
                controllerAs: 'vm',
                template: require('./pages/search/search.html'),
                data: { title: 'CHPL Search' },
            });

        $urlRouterProvider.otherwise('/search');
    }
})();
