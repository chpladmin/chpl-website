export const UploadSurveillancesComponent = {
    templateUrl: 'chpl.surveillance/surveillance/upload.html',
    bindings: {
    },
    controller: class UploadSurveillanceComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplUploadSurveillances', UploadSurveillancesComponent);
