import 'ng-file-upload';

(function () {
    'use strict';

    angular.module('chpl.admin', [
        'angular-confirm',
        'chpl.components',
        'chpl.constants',
        'chpl.services',
        'feature-flags',
        'ngIdle',
        'ngSanitize',
        'smart-table',
        'toaster',
        'ui.bootstrap',
    ]);
})();
