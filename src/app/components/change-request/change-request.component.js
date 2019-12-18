export const ChangeRequestComponent = {
    templateUrl: 'chpl.components/change-request/change-request.html',
    bindings: {
        administrationMode: '<',
        activeState: '<',
        developer: '<',
        changeRequest: '<',
        takeAction: '&',
        showFormErrors: '<',
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
                this.changeRequest.statuses.forEach(s => {
                    switch (s.userPermission.authority) {
                    case 'ROLE_ADMIN':
                    case 'ROLE_ONC':
                        s.actingOrganization = 'ONC';
                        break;
                    case 'ROLE_ACB':
                        s.actingOrganization = s.certificationBody;
                        break;
                    case 'ROLE_DEVELOPER':
                        s.actingOrganization = this.changeRequest.developer.name;
                        break;
                        //no default
                    }
                });
                this.backup.changeRequest = angular.copy(this.changeRequest);
            }
            if (changes.showFormErrors) {
                this.showFormErrors = changes.showFormErrors.currentValue;
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
                data: {
                    changeRequest: this.changeRequest,
                    validity: this.form.$valid,
                },
            });
        }
    },
}

angular.module('chpl.components')
    .component('chplChangeRequest', ChangeRequestComponent);
