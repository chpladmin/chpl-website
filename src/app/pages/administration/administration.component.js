/* global DEVELOPER_MODE */

export const AdministrationComponent = {
    templateUrl: 'chpl.administration/administration.html',
    bindings: {
    },
    controller: class AdministrationComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.DEVELOPER_MODE = DEVELOPER_MODE;
        }
    },
}

angular.module('chpl.administration')
    .component('chplAdministration', AdministrationComponent);
