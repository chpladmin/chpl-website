(function () {
    'use strict';

    angular.module('chpl.admin', ['ngRoute', 'smart-table', 'angularFileUpload', 'chpl.common', 'chpl.loginServices', 'ngIdle', 'ngSanitize', 'ui.bootstrap'])
        .config(function(IdleProvider, KeepaliveProvider) {
            // configure Idle settings
            IdleProvider.idle(60 * 20); // in seconds
            IdleProvider.timeout(false); // in seconds
            KeepaliveProvider.interval(60 * 5); // in seconds
        });

})();
