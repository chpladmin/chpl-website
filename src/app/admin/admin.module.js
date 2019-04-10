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
    ]);
})();
