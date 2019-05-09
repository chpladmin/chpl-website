export const AdministrationComponent = {
    templateUrl: 'chpl.administration/administration.html',
    bindings: {
    },
    controller: class AdministrationComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }
    },
}

angular.module('chpl.administration')
    .component('chplAdministration', AdministrationComponent);
