export const ChangeRequestComponent = {
    templateUrl: 'chpl.components/change-request/change-request.html',
    bindings: {
        administrationMode: '<',
        activeState: '<',
        developer: '<',
        changeRequest: '<',
        changeRequestStatusTypes: '<',
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
                        s.actingOrganization = s.certificationBody.name;
                        break;
                    case 'ROLE_DEVELOPER':
                        s.actingOrganization = this.changeRequest.developer.name;
                        break;
                        //no default
                    }
                });
                this.backup.changeRequest = angular.copy(this.changeRequest);
            }
            if (changes.changeRequestStatusTypes && changes.changeRequestStatusTypes.currentValue) {
                this.changeRequestStatusTypes = changes.changeRequestStatusTypes.currentValue.data
                    .filter(type => type.name !== 'Cancelled by Requester');
            }
            if (changes.showFormErrors) {
                this.showFormErrors = changes.showFormErrors.currentValue;
            }
            if (this.changeRequest && this.changeRequestStatusTypes) {
                let currentStatus = this.changeRequest.currentStatus.changeRequestStatusType.name;
                this.changeRequestStatusTypes = this.changeRequestStatusTypes
                    .filter(type => type.name !== currentStatus);
            }
        }

        cancel () {
            this.changeRequest = angular.copy(this.backup.changeRequest);
            this.showFormErrors = false;
            this.form.$setPristine();
            this.form.$setUntouched();
            this.takeAction({
                action: 'cancel',
            });
        }

        update () {
            this.takeAction({
                action: 'update',
                data: {
                    changeRequest: this.changeRequest,
                },
            });
        }

        handleEditedDeveloper (developer) {
            this.changeRequest.details = developer;
            this.update();
        }

        isCommentEnabled () {
            return this.administrationMode
                || this.activeState === 'withdraw'
                || this.changeRequest.currentStatus.changeRequestStatusType.name === 'Pending Developer Action';
        }

        isCommentRequired () {
            return this.changeRequest.newStatus
                && (this.changeRequest.newStatus.name === 'Rejected'
                    || this.changeRequest.newStatus.name === 'Pending Developer Action');
        }
    },
}

angular.module('chpl.components')
    .component('chplChangeRequest', ChangeRequestComponent);
