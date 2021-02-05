/* global DEVELOPER_MODE ENABLE_LOGGING */

(function () {
  'use strict';

  angular
    .module('chpl')
    .config(config);

  /** @ngInject */
  function config ($analyticsProvider, $breadcrumbProvider, $locationProvider, $logProvider, TitleProvider, stConfig) {
    // Enable/disable analytics tracking
    $analyticsProvider.developerMode(DEVELOPER_MODE);
    // Enable/disable analytics debug tracking
    if (ENABLE_LOGGING) {
      /* eslint-disable no-console,angular/log */
      $analyticsProvider.developerMode(false);
      $analyticsProvider.registerPageTrack(path => console.log({path}));
      $analyticsProvider.registerEventTrack((action, properties) => console.log({action, properties}));
      /* eslint-enable no-console,angular/log */
    }

    $breadcrumbProvider.setOptions({
      includeAbstract: true,
    });

    $locationProvider.hashPrefix('');

    // Enable log
    $logProvider.debugEnabled(ENABLE_LOGGING);

    TitleProvider.enabled(false);

    // Set smart-table pagination template
    stConfig.pagination.template = 'chpl.components/smart-table/stPagination.html';
  }
})();
