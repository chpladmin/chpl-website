/* global ENABLE_LOGGING */

(() => {
  /** @ngInject */
  function config($breadcrumbProvider, $locationProvider, $logProvider) {
    $breadcrumbProvider.setOptions({
      includeAbstract: true,
    });

    $locationProvider.hashPrefix('');

    // Enable log
    $logProvider.debugEnabled(ENABLE_LOGGING);
  }

  angular
    .module('chpl')
    .config(config);
})();
