import 'ng-file-upload';

export default angular
    .module('chpl.surveillance', [
        'chpl.components',
        'chpl.services',
        'feature-flags',
        'ncy-angular-breadcrumb',
        'ngFileUpload',
        'smart-table',
        'ui.bootstrap',
        'ui.router',
    ]);
