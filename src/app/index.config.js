/* global DEVELOPER_MODE ENABLE_LOGGING */

(() => {
  /** @ngInject */
  function config($analyticsProvider, $breadcrumbProvider, $locationProvider, $logProvider, TitleProvider, stConfig) {
    // Enable/disable analytics tracking
    $analyticsProvider.developerMode(DEVELOPER_MODE);

    /* eslint-disable no-console,angular/log */
    // Enable/disable analytics debug tracking
    /* - remove from here to comment block end to enable console logs of analytics data
      if (ENABLE_LOGGING) {
      $analyticsProvider.developerMode(false);
      $analyticsProvider.registerPageTrack(path => console.log({path}));
      $analyticsProvider.registerEventTrack((action, properties) => console.log({action, properties}));
      }
    */
    /* eslint-enable no-console,angular/log */

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
