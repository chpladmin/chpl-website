/* global ENABLE_LOGGING */

(() => {
  /** @ngInject */
  function config($locationProvider, $logProvider) {
    $locationProvider.hashPrefix('');

    // Enable log
    $logProvider.debugEnabled(ENABLE_LOGGING);
  }

  angular
    .module('chpl')
    .config(config);
})();
