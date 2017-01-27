(function () {
    'use strict';

    angular
        .module('chpl')
        .config(config);

    /** @ngInject */
    function config ($logProvider, ENABLE_LOGGING) {
        // Enable log
        $logProvider.debugEnabled(ENABLE_LOGGING);
    }
})();
