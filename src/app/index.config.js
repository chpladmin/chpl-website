/* global DEVELOPER_MODE ENABLE_LOGGING FEATURE_FLAGS */

(function () {
    'use strict';

    angular
        .module('chpl')
        .config(config);

    /** @ngInject */
    function config ($analyticsProvider, $locationProvider, $logProvider, TitleProvider, featureFlagsProvider, stConfig) {
        // Enable/disable analytics tracking
        $analyticsProvider.developerMode(DEVELOPER_MODE);
        /*
        $analyticsProvider.developerMode(false);
        if (ENABLE_LOGGING) {
            $analyticsProvider.registerPageTrack(function (path) {
                console.log('Page tracking: ', path);
            });
            $analyticsProvider.registerEventTrack(function (action, properties) {
                console.log('Event tracking: ', action, properties);
            });
        }
        */
        $locationProvider.hashPrefix('');

        // Enable log
        $logProvider.debugEnabled(ENABLE_LOGGING);

        TitleProvider.enabled(false);

        // Set feature flags
        featureFlagsProvider.setInitialFlags(FEATURE_FLAGS);

        // Set smart-table pagination template
        stConfig.pagination.template = 'chpl.components/smart-table/stPagination.html';
    }
})();
