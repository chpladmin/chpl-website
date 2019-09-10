export const SurveillanceNonconformityInspectComponent = {
    templateUrl: 'chpl.components/listing/details/surveillance/nonconformity/inspect.html',
    bindings: {
        resolve: '<',
        close: '&',
    },
    controller: class SurveillanceNonconformityInspectController {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onInit () {
            this.nonconformities = angular.copy(this.resolve.nonconformities);
        }

        cancel () {
            this.close();
        }
    },
}

angular
    .module('chpl.components')
    .component('aiSurveillanceNonconformityInspect', SurveillanceNonconformityInspectComponent);
