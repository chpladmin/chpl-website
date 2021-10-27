import { administrationStatesConfig as administrationStates } from './pages/administration/administration.state';
import { chartsStatesConfig as chartsStates } from './pages/charts/charts.state';
import collectionsStates from './pages/collections/collections.state';
import { compareStatesConfig as compareStates } from './pages/compare/compare.state';
import listingStates from './pages/listing/listing.state';
import organizationsStates from './pages/organizations/organizations.state';
import { registrationStatesConfig as registrationStates } from './pages/registration/registration.state';
import reportsStates from './pages/reports/reports.state';
import resourcesStates from './pages/resources/resources.state';
import surveillanceStates from './pages/surveillance/surveillance.state';
import usersStates from './pages/users/users.state';

/** @ngInject */
function otherwise($injector, $location) {
  const $state = $injector.get('$state');
  const target = $location.url();
  $state.go('not-found', {
    target,
  });
}

(() => {
  function routeConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('search', {
        url: '/search',
        controller: 'SearchController',
        controllerAs: 'vm',
        template: require('./pages/search/search.html'), // eslint-disable-line global-require
        data: { title: 'CHPL Search' },
      });
    $urlRouterProvider.when('', '/search');
    $urlRouterProvider.when('/', '/search');
    $urlRouterProvider.otherwise(otherwise);
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
