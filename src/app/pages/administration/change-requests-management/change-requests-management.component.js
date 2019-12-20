export const ChangeRequestsManagementComponent = {
    templateUrl: 'chpl.administration/change-requests-management/change-requests-management.html',
    bindings: {
        changeRequests: '<',
        changeRequestStatusTypes: '<',
        changeRequestTypes: '<',
    },
    controller: class ChangeRequestsManagementComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onChanges (changes) {
            if (changes.changeRequests) {
                this.changeRequests = angular.copy(changes.changeRequests.currentValue);
            }
            if (changes.changeRequestStatusTypes) {
                this.changeRequestStatusTypes = angular.copy(changes.changeRequestStatusTypes.currentValue);
            }
            if (changes.changerequestTypes) {
                this.changerequestTypes = angular.copy(changes.changerequestTypes.currentValue);
            }
        }
    },
}

angular.module('chpl.administration')
    .component('chplChangeRequestsManagement', ChangeRequestsManagementComponent);
