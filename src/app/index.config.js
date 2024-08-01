/* global ENABLE_LOGGING */

(() => {
  /** @ngInject */
  function config($breadcrumbProvider, $locationProvider, $logProvider, stConfig) {
    $breadcrumbProvider.setOptions({
      includeAbstract: true,
    });

    $locationProvider.hashPrefix('');

    // Enable log
    $logProvider.debugEnabled(ENABLE_LOGGING);

    // Set smart-table pagination template
    stConfig.pagination.template = 'chpl.components/smart-table/stPagination.html'; // eslint-disable-line no-param-reassign
  }

  angular
    .module('chpl')
    .config(config);
})();
