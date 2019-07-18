export const OncOrganizationComponent = {
    templateUrl: 'chpl.components/onc-organization/onc-organization.html',
    bindings: {
        organization: '<',
        isEditing: '<',
        type: '@',
        takeAction: '&',
    },
    controller: class OncOrganizationComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.backup = {};
            this.valid = {
                address: true,
            }
        }

        $onChanges (changes) {
            if (changes.organization) {
                this.organization = angular.copy(changes.organization.currentValue);
                this.backup.organization = angular.copy(this.organization);
            }
            if (changes.isEditing) {
                this.isEditing = changes.isEditing.currentValue;
            }
        }

        view () {
            this.takeAction({
                action: 'view',
                data: this.organization,
            });
        }

        edit () {
            this.takeAction({
                action: 'edit',
                data: this.organization,
            });
            this.isEditing = true;
        }

        save () {
            if (this.organization.retired) {
                this.organization.retirementDate = this.organization.retirementDateObject.getTime();
            } else {
                this.organization.retirementDate = null;
            }
            if (this.organization.id) {
                this.takeAction({
                    action: 'save',
                    data: this.organization,
                });
            } else {
                this.takeAction({
                    action: 'create',
                    data: this.organization,
                });
            }
            this.isEditing = false;
        }

        cancel () {
            this.takeAction({
                action: 'cancel',
            });
            this.organization = angular.copy(this.backup.organization);
            this.isEditing = false;
        }

        editAddress (address, errors, validForm) {
            if (!this.organization) {
                this.organization = {};
            }
            this.organization.address = angular.copy(address);
            this.valid.address = validForm;
        }

        getCode () {
            if (this.type === 'ONC-ACB') {
                return this.organization.acbCode;
            } else if (this.type === 'ONC-ATL') {
                return this.organization.atlCode;
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplOncOrganization', OncOrganizationComponent);
