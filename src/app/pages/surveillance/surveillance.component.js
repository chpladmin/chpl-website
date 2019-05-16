export const SurveillanceComponent = {
    templateUrl: 'chpl.surveillance/surveillance.html',
    bindings: {
    },
    controller: class SurveillanceComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillance', SurveillanceComponent);
