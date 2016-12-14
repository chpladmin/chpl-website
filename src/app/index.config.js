(function() {
    'use strict';

    angular
        .module('chpl')
        .config(config);

    /** @ngInject */
    function config ($logProvider) {
        // Enable log
        $logProvider.debugEnabled(true);
    }

})();
