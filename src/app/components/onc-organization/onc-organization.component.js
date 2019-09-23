export const OncOrganizationComponent = {
    templateUrl: 'chpl.components/onc-organization/onc-organization.html',
    bindings: {
        organization: '<',
        type: '@',
        takeAction: '&',
    },
    controller: class OncOrganizationComponent {
        constructor ($log, $state) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
        }

        $onChanges (changes) {
            if (changes.organization) {
                this.organization = angular.copy(changes.organization.currentValue);
            }
            if (this.organization && this.organization.name) {
                if (this.$state.includes('**.edit')) {
                    this.$state.$current.parent.ncyBreadcrumb.label = this.organization.name;
                } else {
                    this.$state.current.ncyBreadcrumb.label = this.organization.name;
                }
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
            this.isEditing = false;
        }

        cancel () {
            this.takeAction({
                action: 'cancel',
            });
        }

        takeEditAction (action, data) {
            switch (action) {
            case 'save':
                this.organization = data;
                this.save();
                break;
            case 'create':
                this.organization = data;
                this.save();
                break;
            case 'cancel':
                this.cancel()
                break;
                //no default
            }
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
