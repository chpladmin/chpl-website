export const AdministrationComponent = {
    templateUrl: 'chpl.administration/administration.html',
    bindings: {
    },
    controller: class AdministrationComponent {
        constructor ($log, authService, featureFlags) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.isOn = featureFlags.isOn;
        }
    },
}

angular.module('chpl.administration')
    .component('chplAdministration', AdministrationComponent);
