export const SurveillanceNonconformityInspectComponent = {
    templateUrl: 'chpl.admin/components/surveillance/nonconformity/inspect.html',
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
            this.nonconformities = this.resolve.nonconformities;
        }

        cancel () {
            this.close();
        }
    },
}

angular
    .module('chpl.admin')
    .component('aiSurveillanceNonconformityInspect', SurveillanceNonconformityInspectComponent);
