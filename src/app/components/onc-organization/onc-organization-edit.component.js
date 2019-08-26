export const OncOrganizationEditComponent = {
    templateUrl: 'chpl.components/onc-organization/onc-organization-edit.html',
    bindings: {
        organization: '<',
        type: '@',
        takeAction: '&',
    },
    controller: class OncOrganizationEditComponent {
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
                if (this.organization && this.organization.retirementDate) {
                    this.organization.retirementDateObject = new Date(this.organization.retirementDate);
                }
                this.backup.organization = angular.copy(this.organization);
            }
        }

        save () {
            if (this.organization.id) {
                if (this.organization.retired) {
                    this.organization.retirementDate = this.organization.retirementDateObject.getTime();
                } else {
                    this.organization.retirementDate = null;
                }
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
        }

        cancel () {
            this.takeAction({
                action: 'cancel',
            });
            this.organization = angular.copy(this.backup.organization);
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
    .component('chplOncOrganizationEdit', OncOrganizationEditComponent);
