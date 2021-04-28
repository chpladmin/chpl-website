import { administrationStatesConfig as administrationStates } from './pages/administration/administration.state';
import { chartsStatesConfig as chartsStates } from './pages/charts/charts.state';
import { collectionsStatesConfig as collectionsStates } from './pages/collections/collections.state';
import { compareStatesConfig as compareStates } from './pages/compare/compare.state';
import listingStates from './pages/listing/listing.state';
import { organizationsStatesConfig as organizationsStates } from './pages/organizations/organizations.state';
import { registrationStatesConfig as registrationStates } from './pages/registration/registration.state';
import { reportsStatesConfig as reportsStates } from './pages/reports/reports.state';
import { resourcesStatesConfig as resourcesStates } from './pages/resources/resources.state';
import { surveillanceStatesConfig as surveillanceStates } from './pages/surveillance/surveillance.state';
import { usersStatesConfig as usersStates } from './pages/users/users.state';

(() => {
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('search', {
        url: '/search',
        controller: 'SearchController',
        controllerAs: 'vm',
        /* eslint-disable global-require */
        template: require('./pages/search/search.html'),
        /* eslint-enable global-require */
        data: { title: 'CHPL Search' },
      });

    $urlRouterProvider.otherwise('/search');
  }

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
})();
