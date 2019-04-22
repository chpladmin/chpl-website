/* global DEVELOPER_MODE */

export const FeaturesComponent = {
    templateUrl: 'chpl.administration/features/features.html',
    bindings: {
    },
    controller: class ConfirmListingsComponent {
        constructor ($log, $state, authService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onInit () {
            if (!this.hasAnyRole(['ROLE_ADMIN']) || !DEVELOPER_MODE) {
                this.$state.go('search');
            }
        }
    },
}

angular.module('chpl.administration')
    .component('chplFeatures', FeaturesComponent);
