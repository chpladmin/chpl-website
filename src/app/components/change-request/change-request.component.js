export const ChangeRequestComponent = {
    templateUrl: 'chpl.components/change-request/change-request.html',
    bindings: {
        changeRequest: '<',
        takeAction: '&',
    },
    controller: class ChangeRequestComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.changeRequest) {
                this.changeRequest = angular.copy(changes.changeRequest.currentValue);
            }
        }

        cancel () {
            this.takeAction({
                action: 'cancel',
            });
        }

        delete () {
            this.takeAction({
                action: 'delete',
                data: this.changeRequest.changeRequestId,
            });
        }

        edit () {
            this.takeAction({
                action: 'edit',
                data: this.changeRequest,
            });
        }

        impersonate () {
            this.takeAction({
                action: 'impersonate',
                data: this.changeRequest,
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
