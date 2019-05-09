/* global MINUTES_BETWEEN_KEEPALIVE MINUTES_UNTIL_IDLE */
import 'ng-file-upload';

export default angular
    .module('chpl.administration', [
        'angular-cron-gen',
        'angular-confirm',
        'chpl.constants',
        'chpl.services',
        'ngCsv',
        'ngFileUpload',
        'ngIdle',
        'ngSanitize',
        'smart-table',
        'ui.bootstrap',
        'zxcvbn',
    ]).config((IdleProvider, KeepaliveProvider) => {
        // configure Idle settings
        IdleProvider.idle(60 * MINUTES_UNTIL_IDLE); // in seconds
        //This is required to be > 0 for the IdleProvider to broadcast IdleTimeout event
        IdleProvider.timeout(1); // in seconds
        KeepaliveProvider.interval(60 * MINUTES_BETWEEN_KEEPALIVE); // in seconds
    });
