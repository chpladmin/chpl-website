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
        'ngRoute',
        'ngSanitize',
        'smart-table',
        'ui.bootstrap',
    ])
        .config(function (IdleProvider, KeepaliveProvider) {
            // configure Idle settings
            IdleProvider.idle(60 * MINUTES_UNTIL_IDLE); // in seconds
            IdleProvider.timeout(false); // in seconds
            KeepaliveProvider.interval(60 * MINUTES_BETWEEN_KEEPALIVE); // in seconds
        });
})();
