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

        edit () {
            this.takeAction({
                action: 'edit',
                data: this.organization,
            });
        }

        save () {
            this.takeAction({
                action: 'save',
                data: this.organization,
            });
        }

        cancel () {
            this.takeAction({
                action: 'cancel',
            });
            this.organization = angular.copy(this.backup.organization);
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
