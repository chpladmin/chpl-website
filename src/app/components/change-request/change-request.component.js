export const ChangeRequestComponent = {
    templateUrl: 'chpl.components/change-request/change-request.html',
    bindings: {
        activeState: '<',
        changeRequest: '<',
        takeAction: '&',
    },
    controller: class ChangeRequestComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.activeState) {
                this.activeState = angular.copy(changes.activeState.currentValue);
            }
            if (changes.changeRequest) {
                this.changeRequest = angular.copy(changes.changeRequest.currentValue);
            }
        }

        cancel () {
            this.takeAction({
                action: 'cancel',
            });
        }

        save () {
            this.takeAction({
                action: 'save',
                data: this.changeRequest,
            });
        }
    },
}

angular.module('chpl.components')
    .component('chplChangeRequest', ChangeRequestComponent);
