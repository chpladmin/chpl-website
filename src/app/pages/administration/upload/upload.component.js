export const UploadComponent = {
    templateUrl: 'chpl.administration/upload/upload.html',
    bindings: {
    },
    controller: class UploadComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }
    },
}

angular.module('chpl.administration')
    .component('chplUpload', UploadComponent);
