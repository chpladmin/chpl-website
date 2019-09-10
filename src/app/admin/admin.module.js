import 'ng-file-upload';

(function () {
    'use strict';

    angular.module('chpl.admin', [
        'angular-cron-gen',
        'angular-confirm',
        'chpl.components',
        'chpl.constants',
        'chpl.reports',
        'chpl.services',
        'chpl.surveillance',
        'feature-flags',
        'ngCsv',
        'ngFileUpload',
        'ngIdle',
        'ngSanitize',
        'smart-table',
        'toaster',
        'ui.bootstrap',
        'zxcvbn',
    ]);
})();
