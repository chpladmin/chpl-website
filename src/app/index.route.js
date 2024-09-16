import { administrationStatesConfig as administrationStates } from './pages/administration/administration.state';
import { chartsStatesConfig as chartsStates } from './pages/charts/charts.state';
import { compareStatesConfig as compareStates } from './pages/compare/compare.state';
import listingStates from './pages/listing/listing.state';
import organizationsStates from './pages/organizations/organizations.state';
import { registrationStatesConfig as registrationStates } from './pages/registration/registration.state';
import reportsStates from './pages/reports/reports.state';
import resourcesStates from './pages/resources/resources.state';
import searchStates from './pages/search/search.state';
import subscriptionsStates from './pages/subscriptions/subscriptions.state';
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
    $urlRouterProvider.when('', '/search');
    $urlRouterProvider.when('/', '/search');
    $urlRouterProvider.otherwise(otherwise);
  }

  angular
    .module('chpl')
    .config(routeConfig)
    .config(administrationStates)
    .config(chartsStates)
    .config(compareStates)
    .config(listingStates)
    .config(organizationsStates)
    .config(registrationStates)
    .config(reportsStates)
    .config(resourcesStates)
    .config(searchStates)
    .config(subscriptionsStates)
    .config(surveillanceStates)
    .config(usersStates);
})();
