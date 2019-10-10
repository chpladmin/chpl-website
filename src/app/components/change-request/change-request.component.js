export const ChangeRequestComponent = {
    templateUrl: 'chpl.components/change-request/change-request.html',
    bindings: {
        activeState: '<',
        developer: '<',
        changeRequest: '<',
        takeAction: '&',
    },
    controller: class ChangeRequestComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.backup = {};
        }

        $onChanges (changes) {
            if (changes.activeState) {
                this.activeState = angular.copy(changes.activeState.currentValue);
            }
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.changeRequest) {
                this.changeRequest = angular.copy(changes.changeRequest.currentValue);
                this.backup.changeRequest = angular.copy(changes.changeRequest.currentValue);
            }
        }

        cancel () {
            this.changeRequest = angular.copy(this.backup.changeRequest);
            this.takeAction({
                action: 'cancel',
            });
        }

        update () {
            this.takeAction({
                action: 'update',
                data: this.changeRequest,
            });
        }
    },
}

angular.module('chpl.components')
    .component('chplChangeRequest', ChangeRequestComponent);
