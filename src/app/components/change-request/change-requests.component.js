export const ChangeRequestsComponent = {
    templateUrl: 'chpl.components/change-request/change-requests.html',
    bindings: {
        changeRequests: '<',
        takeAction: '&',
    },
    controller: class ChangeRequestsComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.changeRequests.currentValue) {
                this.changeRequests = angular.copy(changes.changeRequests.currentValue);
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplChangeRequests', ChangeRequestsComponent);
