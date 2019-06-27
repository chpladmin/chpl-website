export const OncOrganizationComponent = {
    templateUrl: 'chpl.components/onc-organization/onc-organization.html',
    bindings: {
        organization: '<',
        canEdit: '<',
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
            if (changes.canEdit) {
                this.canEdit = changes.canEdit.currentValue;
            }
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
                this.organization.retirementDate = undefined;
            }
            this.takeAction({
                action: 'save',
                data: this.organization,
            });
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
            this.organization.address = angular.copy(address);
            this.valid.address = validForm;
        }

        getCode () {
            return this.organization.acbCode;
        }
    },
}

angular.module('chpl.components')
    .component('chplOncOrganization', OncOrganizationComponent);
