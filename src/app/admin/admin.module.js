import 'ng-file-upload';

(function () {
    'use strict';

    angular.module('chpl.admin', [
        'angular-cron-gen',
        'angular-confirm',
        'chpl.constants',
        'chpl.services',
        'feature-flags',
        'ngCsv',
        'ngFileUpload',
        'ngIdle',
        'ngSanitize',
        'smart-table',
        'ui.bootstrap',
        'zxcvbn',
    ]);
})();
