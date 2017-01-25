(function () {
    'use strict';

    angular.module('chpl.admin', ['angular-confirm', 'angularFileUpload', 'chpl.common', 'chpl.loginServices', 'googlechart', 'ngCsv', 'ngIdle', 'ngRoute', 'ngSanitize', 'smart-table', 'ui.bootstrap'])
        .config(function(IdleProvider, KeepaliveProvider) {
            // configure Idle settings
            IdleProvider.idle(60 * 20); // in seconds
            IdleProvider.timeout(false); // in seconds
            KeepaliveProvider.interval(60 * 5); // in seconds
        });

})();
