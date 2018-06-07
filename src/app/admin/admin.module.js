(function () {
    'use strict';

    angular.module('chpl.admin', [
        'angular-cron-jobs',
        'angular-confirm',
        'angularFileUpload',
        'chpl.constants',
        'chpl.services',
        'ngCsv',
        'ngIdle',
        'ngRoute',
        'ngSanitize',
        'smart-table',
        'ui.bootstrap',
    ])
        .config(function (IdleProvider, KeepaliveProvider, MINUTES_BETWEEN_KEEPALIVE, MINUTES_UNTIL_IDLE) {
            // configure Idle settings
            IdleProvider.idle(60 * MINUTES_UNTIL_IDLE); // in seconds
            IdleProvider.timeout(false); // in seconds
            KeepaliveProvider.interval(60 * MINUTES_BETWEEN_KEEPALIVE); // in seconds
        });
})();
