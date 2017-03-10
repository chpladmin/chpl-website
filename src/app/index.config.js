(function () {
    'use strict';

    angular
        .module('chpl')
        .config(config);

    /** @ngInject */
    function config ($logProvider, stConfig, ENABLE_LOGGING) {
        // Enable log
        $logProvider.debugEnabled(ENABLE_LOGGING);
        stConfig.pagination.template = 'app/components/smart_table/stPagination.html';
    }
})();
