/* global MINUTES_BETWEEN_KEEPALIVE MINUTES_UNTIL_IDLE */
(function () {
    'use strict';

    angular.module('chpl.admin', [
        'angular-cron-gen',
        'angular-confirm',
        'angularFileUpload',
        'chpl.constants',
        'chpl.services',
        'ngCsv',
        'ngIdle',
        'ngSanitize',
        'smart-table',
        'ui.bootstrap',
        'zxcvbn',
    ])
        .config(function (IdleProvider, KeepaliveProvider) {
            // configure Idle settings
            IdleProvider.idle(60 * MINUTES_UNTIL_IDLE); // in seconds
            //This is required to be > 0 for the IdleProvider to broadcast IdleTimeout event
            IdleProvider.timeout(1); // in seconds
            KeepaliveProvider.interval(60 * MINUTES_BETWEEN_KEEPALIVE); // in seconds
        });
})();
